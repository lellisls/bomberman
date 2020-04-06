import Random from "../utils/random";

export default function createCreep(game) {
  const VELOCITY = 500;
  const UP = 0;
  const RIGHT = 1;
  const DOWN = 2;
  const LEFT = 3;
  const DIST = 64;
  const RADIUS = 30;

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
    creep.time = new Map();
    return creep;
  }

  function getNextPosition(creep, dx, dy) {
    let { x: cx, y: cy } = creep;
    cx = Math.round((cx - 32) / 64.0) * 64 + 32;
    cy = Math.round((cy - 32) / 64.0) * 64 + 32;

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

  function findCollisions(creep, direction) {
    let { x: cx, y: cy } = creep.body.center;
    cx = Math.round(cx);
    cy = Math.round(cy);

    const [dx, dy] = offsets[direction];

    let collisions = game.collisionFinder.findCollisions(
      cx + dx * DIST,
      cy + dy * DIST,
      RADIUS
    );
    return collisions.filter((collided) => {
      // if (collided.gameObject && collided.gameObject !== creep) {
      //   console.log(collided.gameObject, creep);
      // }
      return (
        !collided.gameObject ||
        (collided.gameObject.name !== "player" && collided.gameObject !== creep)
      );
    });
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

    for (let direction = 0; direction < 5; ++direction) {
      let collisions = findCollisions(creep, direction);
      if (collisions.length <= 0) {
        available.push(direction);
      }
    }
    return filterAvailable(available, creep);
  }

  function getDirectionPos(creep, direction) {
    const [dx, dy] = offsets[direction];
    return getNextPosition(creep, dx * 64, dy * 64);
  }

  let times = new Map();

  function changeCreepDirection(creep) {
    if (!creep || !creep.active || creep.name !== "creep") {
      return false;
    }

    const [scene] = game.scene.scenes;

    let available = findAvailable(creep);

    if (available.length == 0) {
      idle(creep);
      return true;
    }

    available = Random.shuffleArray(available);

    const positions = [0, 1, 2, 3, 4].map((dir) => {
      const [x, y] = getDirectionPos(creep, dir);
      return [x, y].toString();
    });
    positions.forEach((pos) => {
      if (creep.time.get(pos) === undefined) {
        creep.time.set(pos, 0.0);
      }
    });

    const time = positions.map((a) => creep.time.get(a));
    available = available.sort((a, b) => time[a] - time[b]);

    const selected = available[0];
    const nextMove = directions[selected];
    let pos = positions[selected];
    creep.time.set(pos, scene.time.now);
    const [x, y] = getDirectionPos(creep, selected);

    if (times[pos]) {
      times[pos].destroy();
    }
    // times[pos] = scene.add.text(x, y, Math.round(time[selected]).toString());

    // console.log(
    //   "times:",
    //   time.map((t) => Math.round(t)),
    //   "\npositions:",
    //   positions,
    //   "\nselected:",
    //   selected,
    //   "\nselTime:",
    //   time[selected],
    //   "\nsorted:",
    //   available.map((a) => Math.round(time[a]))
    // );
    nextMove(creep);
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
