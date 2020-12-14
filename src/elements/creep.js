import Random from "../utils/random";

export default function createCreep(game) {
  const VELOCITY = 500;
  const UP = 0;
  const RIGHT = 1;
  const DOWN = 2;
  const LEFT = 3;
  const DIST = 64;
  const RADIUS = 24;

  const state = {
    creeps: [],
    group: null,
  };

  const offsets = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, 0],
  ];

  const directions = [moveUp, moveRight, moveDown, moveLeft, idle];

  function getFrames(title, start, end) {
    let frames = [];

    for (let i = start; i < end; ++i) {
      frames.push({ key: `${title}-f${i}` });
    }

    return frames;
  }

  function preload(scene) {
    scene.load.path = "assets/images/";
    for (let i = 0; i < 6; ++i) {
      scene.load.image(`creep-front-f${i}`, `Creep/Front/Creep_F_f0${i}.png`);
      scene.load.image(`creep-back-f${i}`, `Creep/Back/Creep_B_f0${i}.png`);
      scene.load.image(`creep-side-f${i}`, `Creep/Side/Creep_S_f0${i}.png`);
    }
  }

  function createGroup(scene) {
    scene.anims.create({
      key: "creep-front",
      frames: getFrames("creep-front", 0, 6),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "creep-back",
      frames: getFrames("creep-back", 0, 6),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "creep-side",
      frames: getFrames("creep-side", 0, 6),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "creep-idle",
      frames: [{ key: "creep-front-f0" }],
      frameRate: 10,
    });

    state.group = scene.physics.add.group("creeps");
    return state.group;
  }

  function createCreep(x, y, index) {
    let creep = state.group.create(x * 64 + 32, y * 64 + 32, `creep_${index}`);
    creep.setCollideWorldBounds(true);
    creep.setBounce(0);
    creep.body.setSize(48, 48, 0, 0, true);
    creep.body.setOffset(8, 8);
    creep.body.immovable = true;
    this.idle(creep);
    this.state.creeps.push(creep);
    creep.name = "creep";
    creep.index = index;
    creep.time = new Map();
    return creep;
  }

  function getRoundedPosition(x, y) {
    x = Math.round((x - 32) / 64.0) * 64 + 32;
    y = Math.round((y - 32) / 64.0) * 64 + 32;
    return [x, y];
  }

  function getNextPosition(creep, dx, dy) {
    let [cx, cy] = getRoundedPosition(creep.x, creep.y);
    return [cx + dx, cy + dy];
  }

  function moveTo(creep, dx, dy) {
    const [x, y] = getNextPosition(creep, dx, dy);
    var tweens = [
      {
        targets: creep,
        x: { value: x, duration: ((Math.abs(dx) + 32) / 64) * VELOCITY },
        y: { value: y, duration: ((Math.abs(dy) + 32) / 64) * VELOCITY },
      },
    ];
    creep.nextPosition = {x, y};

    const [scene] = game.scene.scenes;
    creep.tweens = scene.tweens.timeline({
      tweens,
    });
    if (game.state.DEBUG) {
      game.collisionFinder.debugCircle(x, y, 10, 1000);
    }
    return creep.tweens;
  }

  function moveUp(creep) {
    creep.anims.play("creep-back", true);
    creep.flipX = false;
    moveTo(creep, 0, -64);
    creep.direction = UP;
  }

  function moveDown(creep) {
    creep.anims.play("creep-front", true);
    creep.flipX = false;
    moveTo(creep, 0, 64);
    creep.direction = DOWN;
  }

  function moveLeft(creep) {
    creep.anims.play("creep-side", true);
    creep.flipX = true;
    moveTo(creep, -64, 0);
    creep.direction = LEFT;
  }

  function moveRight(creep) {
    creep.anims.play("creep-side", true);
    creep.flipX = false;
    moveTo(creep, 64, 0);
    creep.direction = RIGHT;
  }

  function idle(creep) {
    creep.anims.play("creep-idle", true);
    creep.flipX = false;
    moveTo(creep, 0, 0);
    creep.direction = -1;
  }

  function samePosition(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) <= 0 && Math.abs(y1 - y2) <= 0;
  }

  function findNextCollisions(x, y) {
    return state.creeps.filter(c => !!c && !!c.nextPosition).filter((c) => samePosition(c.nextPosition.x, c.nextPosition.y, x, y));
  }

  function findCollisions(creep, x, y) {
    // let [cx, cy] = getRoundedPosition(creep.x, creep.y);

    const creepCollisions = state.creeps.filter((c) => samePosition(c, x, y));
    const nextCollisions = findNextCollisions(x, y);
    let collisions = game.collisionFinder.findCollisions(x, y, RADIUS);

    return collisions
      .filter((collided) => {
        // if (collided.gameObject && collided.gameObject !== creep) {
        //   console.log(collided.gameObject, creep);
        // }
        return (
          !collided.gameObject ||
          collided.gameObject.name !== "player" ||
          (collided.gameObject.name === "creep" &&
            collided.gameObject.index !== creep.index)
        );
      })
      .concat(creepCollisions, nextCollisions);
  }

  function filterAvailable(available, { direction }) {
    if (available.length < 2) {
      return available;
    }
    return available.filter(
      (dir) => dir === direction || dir % 2 !== direction % 2
    );
  }

  function findAvailable(creep) {
    const available = [];

    for (let direction = 0; direction < 4; ++direction) {
      const [dx, dy] = getDirectionPos(creep, direction);

      let collisions = findCollisions(creep, dx, dy);
      // if(nextCollisions.length > 0) {
      //   console.log(creep, nextCollisions);
      // }

      if (collisions.length == 0) {
        available.push(direction);
      }
    }
    return filterAvailable(available, creep);
  }

  function getDirectionPos(creep, direction) {
    const [dx, dy] = offsets[direction];
    return getNextPosition(creep, dx * 64, dy * 64);
  }

  function changeCreepDirection(creep) {
    if (!creep || !creep.active || creep.name !== "creep") {
      return false;
    }

    const [scene] = game.scene.scenes;

    const position = getNextPosition(creep, 0, 0);
    creep.time.set(position.toString(), scene.time.now);

    let available = findAvailable(creep);

    if (available.length == 0) {
      idle(creep);
      return true;
    }

    available = Random.shuffleArray(available);

    const positions = [0, 1, 2, 3].map((dir) => {
      const [x, y] = getDirectionPos(creep, dir);
      return [x, y].toString();
    });

    for (let pos of positions) {
      if (creep.time.get(pos) === undefined) {
        creep.time.set(pos, 0.0);
      }
    }

    const time = positions.map((a) => creep.time.get(a));
    available = available.sort((a, b) => time[a] - time[b]);

    const selected = available[0];
    const nextMove = directions[selected];
    // let pos = positions[selected];

    nextMove(creep);
    return true;
  }

  function changeDirection(col1, col2) {
    if (changeCreepDirection(col1)) {
      return true;
    }
    return changeCreepDirection(col2);
  }

  return {
    createCreep,
    createGroup,
    changeDirection,
    preload,
    state,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    idle,
  };
}
