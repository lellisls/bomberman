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
  bombsGroup: null,
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
  state.bombsGroup = bombManager.createGroup(this);
  this.physics.add.collider(state.bombsGroup, state.sprites.player);
  this.physics.add.collider(state.bombsGroup, state.bombsGroup);
  this.input.keyboard.on("keydown-SPACE", placeBomb);
}

function debugCircle(cx, cy, radius) {
  var color = 0xffff00;
  var thickness = 4;
  var alpha = 1;

  let graphics = scene.add.graphics(0, 0);
  graphics.lineStyle(thickness, color, alpha);

  graphics.strokeCircle(cx, cy, radius);
}

function placeBomb() {
  const { bx, by } = player.getBombPosition();
  const { solidBlocksLayer } = state.scenario;
  const [scene] = game.scene.scenes;
  var radius = 20;
  const collided = scene.physics.overlapCirc(bx, by, radius, true, true);

  if (collided.length > 0) {
    console.log(
      "COLLIDED:",
      collided.map((elm) => elm.gameObject.name)
    );
    return;
  }

  if (solidBlocksLayer.getTileAtWorldXY(bx, by) !== null) {
    console.log("COLLIDED:", solidBlocksLayer.getTileAtWorldXY(bx, by));
    return;
  }

  bombManager.createBomb(bx, by);
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
