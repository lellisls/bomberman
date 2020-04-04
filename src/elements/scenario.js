export default function createScenario(game) {
  let sprite = null;

  function preload(scene) {
    scene.load.image("background-tile", "Blocks/BackgroundTile.png");
    scene.load.image("explodable-block", "Blocks/ExplodableBlock.png");
    scene.load.image("portal", "Blocks/Portal.png");
    scene.load.image("solid-block", "Blocks/SolidBlock.png");
  }

  function createSprites(scene, { data: board, width, height }) {
    let data = [];
    for (let y = 0; y < height; ++y) {
      let row = [];
      for (let x = 0; x < width; ++x) {
        row[x] = 0;
      }
      data.push(row);
    }

    console.table(board);
    console.table(data);

    let map = scene.make.tilemap({
      tileWidth: 64,
      tileHeight: 64,
      width,
      height,
      data,
    });

    var backgroundTile = map.addTilesetImage("background-tile", null, 64, 64);
    var solidTile = map.addTilesetImage("solid-block", null, 64, 64);
    var explodableBlockTile = map.addTilesetImage(
      "explodable-block",
      null,
      64,
      64
    );
    var grassLayer = map.createDynamicLayer(0, backgroundTile);
    var solidBlocksLayer = map.createBlankDynamicLayer(
      "solid-blocks",
      solidTile
    );
    var explodableBlocksLayer = map.createBlankDynamicLayer(
      "explodable-blocks",
      explodableBlockTile
    );
    // var solidBlocks = map.createBlankDynamicLayer("blank", solidTile, 0, 0);

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        if ("solid-block" === board[y][x]) {
          solidBlocksLayer.putTileAt(0, x, y);
        } else if ("explodable-block" === board[y][x]) {
          explodableBlocksLayer.putTileAt(0, x, y);
        }
      }
    }

    console.log(map);

    solidBlocksLayer.setCollisionByExclusion([-1]);
    explodableBlocksLayer.setCollisionByExclusion([-1]);

    return {
      grassLayer,
      solidBlocksLayer,
      explodableBlocksLayer,
    };
  }

  return {
    preload,
    createSprites,
    sprite,
  };
}
