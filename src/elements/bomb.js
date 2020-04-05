export default function createBomb(game) {
  const state = {
    bombGroup: null,
    flameGroup: null,
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

  function createGroups(scene) {
    state.bombGroup = scene.physics.add.group("bombs");
    state.flameGroup = scene.physics.add.group("flames");

    state.animation = scene.anims.create({
      key: "explode",
      frames: getFrames("bomb", 0, 3),
      frameRate: 1,
    });

    state.animation = scene.anims.create({
      key: "flame",
      frames: getFrames("flame", 0, 5),
      frameRate: 10,
    });

    return { bombGroup: state.bombGroup, flameGroup: state.flameGroup };
  }

  function createBomb(bx, by) {
    const bomb = state.bombGroup.create(bx, by, "bomb-f0");
    bomb.setCollideWorldBounds(true);
    bomb.setBounce(0.5);
    bomb.body.setSize(48, 48, 0, 0, true);
    bomb.body.immovable = true;
    bomb.name = "bomb";
    bomb.play("explode");
    return bomb;
  }

  function createFlame(bx, by) {
    const flame = state.bombGroup.create(bx, by, "flame-f0");
    flame.setCollideWorldBounds(true);
    flame.setBounce(0.5);
    flame.body.setSize(48, 48, 0, 0, true);
    flame.body.immovable = true;
    flame.name = "flame";
    flame.play("flame");

    flame.on("animationcomplete-flame", () => {
      flame.destroy();
    });

    return flame;
  }

  return {
    createGroups,
    createBomb,
    createFlame,
    preload,
  };
}
