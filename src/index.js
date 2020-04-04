import boardGenerator from "./utils/boardGenerator";
import Phaser from "phaser";
import createPlayer from "./elements/player";
import createScenario from "./elements/scenario";
import createCreep from "./elements/creep";

const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 11;

var config = {
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

let player = createPlayer(game);
let scenario = createScenario(game);
let creepManager = createCreep(game);

let cursors;

let state = {
  level: 1,
  board: {},
};

function preload() {
  player.preload(this);
  scenario.preload(this);
  creepManager.preload(this);
}

function create() {
  state.board = boardGenerator(state.level, BOARD_WIDTH, BOARD_HEIGHT);

  const { solidBlocksLayer, explodableBlocksLayer } = scenario.createSprites(
    this,
    state.board
  );

  const playerSprite = player.createSprite(this);
  const creepSprites = [];

  for (let y = 0; y < state.board.height; ++y) {
    for (let x = 0; x < state.board.width; ++x) {
      if ("creep" === state.board.data[y][x]) {
        let creep = creepManager.createSprite(
          this,
          {
            x,
            y,
          },
          creepSprites.length
        );
        creepSprites.push(creep);
      }
    }
  }

  this.physics.add.collider(solidBlocksLayer, playerSprite);
  this.physics.add.collider(explodableBlocksLayer, playerSprite);

  cursors = this.input.keyboard.createCursorKeys();
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
