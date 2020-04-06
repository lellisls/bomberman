export default function boardGenerator(level, width, height) {
  let board = [];
  let creepCounter = 0;
  for (let y = 0; y < height; ++y) {
    let row = [];
    for (let x = 0; x < width; ++x) {
      if (x == 0 || x + 1 == width || y == 0 || y + 1 == height) {
        row.push("solid-block");
      } else if ((x + 1) % 2 && (y + 1) % 2) {
        row.push("solid-block");
      } else if (x <= 2 && y <= 2) {
        row.push("bomberman");
      } else if (Math.round(Math.random() * 10) < 6) {
        row.push("explodable-block");
      } else if (Math.round(Math.random() * 10) < 3 && creepCounter < 5) {
        row.push("creep");
        creepCounter++;
      } else {
        row.push("background-tile");
      }
    }
    board.push(row);
  }
  board[height - 2][width - 2] = "portal";
  return { data: board, width, height };
}
