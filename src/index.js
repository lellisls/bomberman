import boardGenerator from "./utils/boardGenerator";
import Phaser from "phaser";
import createPlayer from "./elements/player";

var config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 650,
  backgroundColor: "#4d4d4d",
  pixelArt: true,
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);

let player;
let cursors;

let state = {
  level: 1,
  board: [],
  boardWidth: 13,
  boardHeight: 13,
};

function preload() {
  this.load.path = "assets/images/";

  for (let i = 0; i < 8; ++i) {
    this.load.image(`bman-front-f${i}`, `Bomberman/Front/Bman_F_f0${i}.png`);
    this.load.image(`bman-back-f${i}`, `Bomberman/Back/Bman_B_f0${i}.png`);
    this.load.image(`bman-side-f${i}`, `Bomberman/Side/Bman_F_f0${i}.png`);
  }
}

function create() {
  state.board = boardGenerator(
    state.level,
    state.boardWidth,
    state.boardHeight
  );

  player = createPlayer(this);
  player.createSprite();

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
