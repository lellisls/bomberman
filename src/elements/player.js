export default function createPlayer(game) {
  let sprite = null;

  function getBmanFrames(title, start, end) {
    let frames = [];

    for (let i = start; i < end; ++i) {
      frames.push({ key: `${title}-f${i}` });
    }

    return frames;
  }

  function createSprite() {
    game.anims.create({
      key: "bomberman-front",
      frames: getBmanFrames("bman-front", 0, 8),
      frameRate: 8,
      repeat: -1,
    });

    game.anims.create({
      key: "bomberman-back",
      frames: getBmanFrames("bman-back", 0, 8),
      frameRate: 8,
      repeat: -1,
    });

    game.anims.create({
      key: "bomberman-side",
      frames: getBmanFrames("bman-side", 0, 8),
      frameRate: 8,
      repeat: -1,
    });

    game.anims.create({
      key: "bomberman-idle",
      frames: [{ key: "bman-front-f0" }],
      frameRate: 10,
    });

    sprite = game.add.sprite(400, 300, "bomberman");
    return sprite;
  }

  function moveUp() {
    sprite.anims.play("bomberman-back", true);
    sprite.flipX = false;
  }

  function moveDown() {
    sprite.anims.play("bomberman-front", true);
    sprite.flipX = false;
  }

  function moveLeft() {
    sprite.anims.play("bomberman-side", true);
    sprite.flipX = true;
  }

  function moveRight() {
    sprite.anims.play("bomberman-side", true);
    sprite.flipX = false;
  }

  function idle() {
    sprite.anims.play("bomberman-idle", true);
    sprite.flipX = false;
  }

  return {
    createSprite,
    sprite,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    idle,
  };
}
