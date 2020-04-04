import Phaser from "phaser";

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

function preload() {
  this.load.path = "assets/images/";

  for (let i = 0; i < 8; ++i) {
    this.load.image(`bman-front-f${i}`, `Bomberman/Front/Bman_F_f0${i}.png`);
    this.load.image(`bman-back-f${i}`, `Bomberman/Back/Bman_B_f0${i}.png`);
    this.load.image(`bman-side-f${i}`, `Bomberman/Side/Bman_F_f0${i}.png`);
  }
}

function getBmanFrames(title, start, end) {
  let frames = [];

  for (let i = start; i < end; ++i) {
    frames.push({ key: `${title}-f${i}` });
  }

  return frames;
}

function create() {
  this.anims.create({
    key: "bomberman-front",
    frames: getBmanFrames("bman-front", 0, 8),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "bomberman-back",
    frames: getBmanFrames("bman-back", 0, 8),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "bomberman-side",
    frames: getBmanFrames("bman-side", 0, 8),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "bomberman-idle",
    frames: [{ key: "bman-front-f0" }],
    frameRate: 10,
  });

  player = this.add.sprite(400, 300, "bomberman");

  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
  player.flipX = false;
  if (cursors.up.isDown) {
    player.anims.play("bomberman-back", true);
  } else if (cursors.down.isDown) {
    player.anims.play("bomberman-front", true);
  } else if (cursors.left.isDown) {
    player.anims.play("bomberman-side", true);
    player.flipX = true;
  } else if (cursors.right.isDown) {
    player.anims.play("bomberman-side", true);
  } else {
    player.anims.play("bomberman-idle", true);
  }
}
