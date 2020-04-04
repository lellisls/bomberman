export default function boardGenerator(level, width, height) {
  let board = [];
  for (let y = 0; y < height; ++y) {
    let row = [];
    for (let x = 0; x < width; ++x) {
      if (x == 0 || x + 1 == width || y == 0 || y + 1 == height) {
        row.push("solid-block");
      } else if ((x + 1) % 2 && (y + 1) % 2) {
        row.push("solid-block");
      } else {
        row.push("background-tile");
      }
    }
    board.push(row);
  }
  return board;
}
