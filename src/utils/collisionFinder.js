export default function createCollisionFinder(game) {
  function findCollisions(bx, by, radius) {
    const { solidBlocksLayer } = game.state.scenario;
    const [scene] = game.scene.scenes;
    if (game.state.DEBUG) {
      debugCircle(bx, by, radius);
    }

    const collided = scene.physics.overlapCirc(bx, by, radius);
    // const collided = scene.physics.overlapRect(bx - 30, by - 30, 60, 60);
    const tile = solidBlocksLayer.getTileAtWorldXY(bx, by);
    if (tile !== null) {
      collided.push(tile);
    }

    // if (collided.length > 0) {
    //   console.log(
    //     "COLLIDED:",
    //     collided.map((elm) => (elm.gameObject ? elm.gameObject.name : elm))
    //   );
    // }

    return collided;
  }

  function debugCircle(cx, cy, radius, timeout) {
    if (!timeout) {
      timeout = 100;
    }

    const [scene] = game.scene.scenes;

    var color = 0xff00ff;
    var thickness = 1;
    var alpha = 1;

    let graphics = scene.add.graphics(0, 0);
    graphics.lineStyle(thickness, color, alpha);

    graphics.strokeCircle(cx, cy, radius);
    scene.time.delayedCall(timeout, () => {
      graphics.destroy();
    });
  }

  return { findCollisions, debugCircle };
}
