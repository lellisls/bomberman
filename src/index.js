import boardGenerator from "./utils/boardGenerator";
import Phaser from "phaser";
import createPlayer from "./elements/player";
import createScenario from "./elements/scenario";
import createCreep from "./elements/creep";
import createBomb from "./elements/bomb";

const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 11;

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: BOARD_WIDTH * 64,
  height: BOARD_HEIGHT * 64,
  backgroundColor: "#4d4d4d",
  pixelArt: true,
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);

const player = createPlayer(game);
const scenario = createScenario(game);
const creepManager = createCreep(game);
const bombManager = createBomb(game);

const state = {
  level: 1,
  board: {},
  sprites: {
    player: null,
    creeps: [],
    portal: null,
  },
  bombGroup: null,
  creepGroup: null,
  scenario: {},
};

let cursors;

function preload() {
  player.preload(this);
  scenario.preload(this);
  creepManager.preload(this);
  bombManager.preload(this);
}

function create() {
  state.board = boardGenerator(state.level, BOARD_WIDTH, BOARD_HEIGHT);

  state.scenario = scenario.createSprites(this, state.board);
  const { solidBlocksLayer, explodableBlocksGroup, portal } = state.scenario;

  state.sprites.portal = portal;
  state.sprites.player = player.createSprite(this);
  state.sprites.creeps = [];
  state.creepGroup = creepManager.createGroup(this);

  for (let y = 0; y < state.board.height; ++y) {
    for (let x = 0; x < state.board.width; ++x) {
      if ("creep" === state.board.data[y][x]) {
        const index = state.sprites.creeps.length;
        let creep = creepManager.createCreep(x, y, index);
        state.sprites.creeps.push(creep);
      }
    }
  }

  this.physics.add.collider(state.sprites.player, solidBlocksLayer);
  this.physics.add.collider(state.sprites.player, explodableBlocksGroup);

  cursors = this.input.keyboard.createCursorKeys();
  const { bombGroup, flameGroup } = bombManager.createGroups(this);

  state.bombGroup = bombGroup;
  state.flameGroup = flameGroup;

  this.physics.add.collider(state.bombGroup, state.sprites.player);
  this.input.keyboard.on("keydown-SPACE", placeBomb);
}

function debugCircle(cx, cy, radius) {
  const [scene] = game.scene.scenes;

  var color = 0xffff00;
  var thickness = 4;
  var alpha = 1;

  let graphics = scene.add.graphics(0, 0);
  graphics.lineStyle(thickness, color, alpha);

  graphics.strokeCircle(cx, cy, radius);
}

function findCollisions(scene, bx, by, radius) {
  const { solidBlocksLayer } = state.scenario;

  // debugCircle(bx, by, radius);
  let collided = scene.physics.overlapCirc(bx, by, radius, true, true);
  const tile = solidBlocksLayer.getTileAtWorldXY(bx, by);
  if (tile !== null) {
    collided = [tile, ...collided];
  }

  if (collided.length > 0) {
    console.log(
      "COLLIDED:",
      collided.map((elm) => (elm.gameObject ? elm.gameObject.name : elm))
    );
  }

  return collided;
}

function explode(scene, bx, by, factorX, factorY) {
  for (let dist = 1; dist < 3; ++dist) {
    const fx = bx + 64 * dist * factorX;
    const fy = by + 64 * dist * factorY;
    const collisions = findCollisions(scene, fx, fy, 20);

    if (collisions.length > 0) {
      collisions.forEach((coll) => {
        if (coll.gameObject) {
          if (coll.gameObject.name === "portal") {
            return;
          } else if (coll.gameObject.name === "player") {
            console.log("YOU LOSE");
          }
          coll.gameObject.destroy();
          bombManager.createFlame(fx, fy);
        }
      });
      break;
    } else {
      bombManager.createFlame(fx, fy);
    }
  }
}

function placeBomb() {
  const { bx, by } = player.getBombPosition();
  const [scene] = game.scene.scenes;
  const bombCollisions = findCollisions(scene, bx, by, 20);

  if (bombCollisions.length > 0) {
    return;
  }

  const bomb = bombManager.createBomb(bx, by);
  bomb.on("animationcomplete-explode", () => {
    bomb.destroy();
    bombManager.createFlame(bx, by);
    explode(scene, bx, by, -1, 0);
    explode(scene, bx, by, 0, -1);
    explode(scene, bx, by, 1, 0);
    explode(scene, bx, by, 0, 1);
  });
}

function update(time, delta) {
  if (cursors.up.isDown) {
    player.moveUp();
  } else if (cursors.down.isDown) {
    player.moveDown();
  } else if (cursors.left.isDown) {
    player.moveLeft();
  } else if (cursors.right.isDown) {
    player.moveRight();
  } else {
    player.idle();
  }
}
