export default function createBomb(game) {
  const state = {
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
    for (let i = 0; i < 3; ++i) {
      scene.load.image(`bomb-f${i}`, `Bomb/Bomb_f0${i}.png`);
    }
    for (let i = 0; i < 5; ++i) {
      scene.load.image(`flame-f${i}`, `Flame/Flame_f0${i}.png`);
    }
  }

  function createGroup(scene) {
    state.group = scene.physics.add.group("bombs");

    scene.anims.create({
      key: "bomb",
      frames: getFrames("bomb", 0, 3),
      frameRate: 1,
    });

    return state.group;
  }

  function createBomb(bx, by) {
    const bomb = state.group.create(bx, by, "bomb-f0");
    bomb.setCollideWorldBounds(true);
    bomb.setBounce(0.5);
    bomb.body.setSize(48, 48, false);
    bomb.body.immovable = true;
    bomb.name = "bomb";
    bomb.play("bomb");
    return bomb;
  }

  return {
    createGroup,
    createBomb,
    preload,
  };
}
