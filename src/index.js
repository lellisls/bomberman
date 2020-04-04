import Phaser from "phaser";

var config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 650,
  backgroundColor: "#4d4d4d",
  pixelArt: true,
  scene: {
    preload: preload,
    create: create,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.path = "assets/images/";

  for (let i = 0; i < 8; ++i) {
    this.load.image(`bman-front-f${i}`, `Bomberman/Front/Bman_F_f0${i}.png`);
  }
}

function create() {
  this.anims.create({
    key: "snooze",
    frames: [
      { key: "bman-front-f0" },
      { key: "bman-front-f1" },
      { key: "bman-front-f2" },
      { key: "bman-front-f3" },
      { key: "bman-front-f4" },
      { key: "bman-front-f5" },
      { key: "bman-front-f6" },
      { key: "bman-front-f7" },

    ],
    frameRate: 8,
    repeat: -1,
  });

  this.add.sprite(400, 300, "cat1").play("snooze");
}
