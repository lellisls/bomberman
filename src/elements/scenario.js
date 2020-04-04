export default function createScenario(game) {
  let sprite = null;

  function preload(scene) {
    scene.load.image("background-tile", "Blocks/BackgroundTile.png");
    scene.load.image("explodable-block", "Blocks/ExplodableBlock.png");
    scene.load.image("portal", "Blocks/Portal.png");
    scene.load.image("solid-block", "Blocks/SolidBlock.png");
  }

  function createSprites(scene, { board, boardWidth, boardHeight }) {
    // let map = scene.make.tilemap("map");
    for (let y = 0; y < boardHeight; ++y) {
      for (let x = 0; x < boardWidth; ++x) {
        board[y][x] = 0;
      }
    }
    let map = scene.make.tilemap({
      data: board,
      tileWidth: 64,
      tileHeight: 64,
      width: boardWidth,
      height: boardHeight,
    });
    var tileset = map.addTilesetImage("background-tile", null, 64, 64);
    var grass = map.createDynamicLayer(0, tileset, 0, 0);
    // var sprites = map.createFromObjects('grass','grass')
  }

  return {
    preload,
    createSprites,
    sprite,
  };
}
