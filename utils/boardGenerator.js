import Constants from "./constants.js";

export default function boardGenerator(level, width, height) {
  let board = [];
  for (let y = 0; y < height; ++y) {
    let row = [];
    for (let x = 0; x < width; ++x) {
      if (x == 0 || x + 1 == width || y == 0 || y + 1 == height) {
        row.push(Constants.SolidBlock);
      } else if ((x + 1) % 2 && (y + 1) % 2) {
        row.push(Constants.SolidBlock);
      } else {
        row.push(Constants.BackgroundTile);
      }
    }
    board.push(row);
  }
  return board;
}
