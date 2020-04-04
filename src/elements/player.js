export default function createPlayer(game) {
  const VELOCITY = 100;
  let player = null;

  function getBmanFrames(title, start, end) {
    let frames = [];

    for (let i = start; i < end; ++i) {
      frames.push({ key: `${title}-f${i}` });
    }

    return frames;
  }

  function preload(scene) {
    scene.load.path = "assets/images/";
    for (let i = 0; i < 8; ++i) {
      scene.load.image(`bman-front-f${i}`, `Bomberman/Front/Bman_F_f0${i}.png`);
      scene.load.image(`bman-back-f${i}`, `Bomberman/Back/Bman_B_f0${i}.png`);
      scene.load.image(`bman-side-f${i}`, `Bomberman/Side/Bman_F_f0${i}.png`);
    }
  }

  function createSprite(scene) {
    scene.anims.create({
      key: "bomberman-front",
      frames: getBmanFrames("bman-front", 0, 8),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "bomberman-back",
      frames: getBmanFrames("bman-back", 0, 8),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "bomberman-side",
      frames: getBmanFrames("bman-side", 0, 8),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "bomberman-idle",
      frames: [{ key: "bman-front-f0" }],
      frameRate: 10,
    });

    player = scene.physics.add.sprite(96, 64, "bomberman");
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    player.body.setOffset(10, 100);
    player.body.setSize(44, 28, false);
    return player;
  }

  function moveUp() {
    player.anims.play("bomberman-back", true);
    player.flipX = false;
    player.body.setVelocityX(0);
    player.body.setVelocityY(-VELOCITY);
  }

  function moveDown() {
    player.anims.play("bomberman-front", true);
    player.flipX = false;
    player.body.setVelocityX(0);
    player.body.setVelocityY(+VELOCITY);
  }

  function moveLeft() {
    player.anims.play("bomberman-side", true);
    player.flipX = true;
    player.body.setVelocityX(-VELOCITY);
    player.body.setVelocityY(0);
  }

  function moveRight() {
    player.anims.play("bomberman-side", true);
    player.flipX = false;
    player.body.setVelocityX(+VELOCITY);
    player.body.setVelocityY(0);
  }

  function idle() {
    player.anims.play("bomberman-idle", true);
    player.flipX = false;
    player.body.setVelocityX(0);
    player.body.setVelocityY(0);
  }

  return {
    createSprite,
    preload,
    sprite: player,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    idle,
  };
}
