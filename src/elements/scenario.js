export default function createScenario(game) {
  let sprite = null;

  function preload(scene) {
    scene.load.image("background-tile", "Blocks/BackgroundTile.png");
    scene.load.image("explodable-block", "Blocks/ExplodableBlock.png");
    scene.load.image("portal", "Blocks/Portal.png");
    scene.load.image("solid-block", "Blocks/SolidBlock.png");
  }

  function createSprites(
    scene,
    { board, boardWidth: width, boardHeight: height }
  ) {
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

    var backgroundTile = map.addTilesetImage(0, "background-tile", 64, 64);
    var solidTile = map.addTilesetImage(1, "solid-block", 64, 64);
    var grass = map.createDynamicLayer(0, backgroundTile, 0, 0);
    var solidBlocks = map.createBlankDynamicLayer("blank", solidTile, 0, 0);
    // var solidBlocks = map.createBlankDynamicLayer("blank", solidTile, 0, 0);

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        if ("solid-block" === board[y][x]) {
          solidBlocks.putTileAt(0, x, y);
        }
      }
    }

    console.log(map);

    solidBlocks.setCollisionByExclusion([-1]);

    return {
      grass,
      solidBlocks,
    };
  }

  return {
    preload,
    createSprites,
    sprite,
  };
}
