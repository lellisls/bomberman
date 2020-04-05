export default function createCreep(game) {
  const VELOCITY = 100;
  const state = {
    creeps: [],
    group: null,
  };

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
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "creep-back",
      frames: getFrames("creep-back", 0, 6),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "creep-side",
      frames: getFrames("creep-side", 0, 6),
      frameRate: 8,
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
    creep.setBounce(0.2);
    creep.body.setSize(48, 48, true);
    creep.body.setOffset(8, 8);
    this.idle(creep);
    this.state.creeps.push(creep);
    return creep;
  }

  function moveUp(creep) {
    creep.anims.play("creep-back", true);
    creep.flipX = false;
    creep.body.setVelocityX(0);
    creep.body.setVelocityY(-VELOCITY);
  }

  function moveDown(creep) {
    creep.anims.play("creep-front", true);
    creep.flipX = false;
    creep.body.setVelocityX(0);
    creep.body.setVelocityY(+VELOCITY);
  }

  function moveLeft(creep) {
    creep.anims.play("creep-side", true);
    creep.flipX = true;
    creep.body.setVelocityX(-VELOCITY);
    creep.body.setVelocityY(0);
  }

  function moveRight(creep) {
    creep.anims.play("creep-side", true);
    creep.flipX = false;
    creep.body.setVelocityX(+VELOCITY);
    creep.body.setVelocityY(0);
  }

  function idle(creep) {
    creep.anims.play("creep-idle", true);
    creep.flipX = false;
    creep.body.setVelocityX(0);
    creep.body.setVelocityY(0);
  }

  return {
    createCreep,
    createGroup,
    preload,
    state,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    idle,
  };
}
