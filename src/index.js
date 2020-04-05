import boardGenerator from "./utils/boardGenerator";
import Phaser from "phaser";
import createPlayer from "./elements/player";
import createScenario from "./elements/scenario";
import createCreep from "./elements/creep";

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

const state = {
  level: 1,
  board: {},
  sprites: {
    player: null,
    creeps: [],
    portal: null,
  },
  bombsGroup: null,
};

let cursors;

function preload() {
  player.preload(this);
  scenario.preload(this);
  creepManager.preload(this);
  this.load.image("bomb", "Bomb/Bomb_f01.png");
}

function create() {
  state.board = boardGenerator(state.level, BOARD_WIDTH, BOARD_HEIGHT);

  const {
    solidBlocksLayer,
    explodableBlocksLayer,
    portal,
  } = scenario.createSprites(this, state.board);

  state.sprites.portal = portal;
  state.sprites.player = player.createSprite(this);
  state.sprites.creeps = [];

  for (let y = 0; y < state.board.height; ++y) {
    for (let x = 0; x < state.board.width; ++x) {
      if ("creep" === state.board.data[y][x]) {
        let creep = creepManager.createSprite(
          this,
          {
            x,
            y,
          },
          state.sprites.creeps.length
        );
        state.sprites.creeps.push(creep);
      }
    }
  }

  this.physics.add.collider(solidBlocksLayer, state.sprites.player);
  this.physics.add.collider(explodableBlocksLayer, state.sprites.player);
  cursors = this.input.keyboard.createCursorKeys();
  state.bombsGroup = this.physics.add.group("bombs");

  this.input.keyboard.on("keydown-SPACE", placeBomb);
}

function placeBomb() {
  const { left, right, top } = state.sprites.player.body;
  const { direction } = player.state;
  const center = left + (right - left) / 2;
  let bx = center;
  let by = top;
  if ("up" === direction) {
    by -= 64;
  } else if ("down" === direction) {
    by += 64;
  } else if ("left" === direction) {
    bx -= 64;
  } else if ("right" === direction) {
    bx += 64;
  }
  bx = Math.round((bx - 32) / 64) * 64 + 32;
  by = Math.round((by - 32) / 64) * 64 + 32;

  const bomb = state.bombsGroup.create(bx, by, "bomb");
  bomb.setCollideWorldBounds(true);
  bomb.body.setSize(48, 48, false);
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
