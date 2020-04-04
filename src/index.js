import boardGenerator from "./utils/boardGenerator";
import Phaser from "phaser";
import createPlayer from "./elements/player";
import createScenario from "./elements/scenario";

var config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 704,
  height: 704,
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

let cursors;

let state = {
  level: 1,
  board: [],
  boardWidth: 11,
  boardHeight: 11,
};

function preload() {
  player.preload(this);
  scenario.preload(this);
}

function create() {
  state.board = boardGenerator(
    state.level,
    state.boardWidth,
    state.boardHeight
  );

  scenario.createSprites(this, state);
  player.createSprite(this);

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
