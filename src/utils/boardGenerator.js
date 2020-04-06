import Random from "../utils/random";

export default function boardGenerator(level, width, height) {
  let board = [];
  let empty = [];
  for (let y = 0; y < height; ++y) {
    let row = [];
    for (let x = 0; x < width; ++x) {
      if (x == 0 || x + 1 == width || y == 0 || y + 1 == height) {
        row.push("solid-block");
      } else if ((x + 1) % 2 && (y + 1) % 2) {
        row.push("solid-block");
      } else if (x <= 2 && y <= 2) {
        row.push("bomberman");
      } else if (Math.round(Math.random() * 10) < 5) {
        row.push("explodable-block");
      } else {
        empty.push({ x, y });
        row.push("background-tile");
      }
    }
    board.push(row);
  }

  let creeps = 10;
  empty = Random.shuffleArray(empty);
  for (let i = 0; i < Math.min(empty.length, creeps); ++i) {
    const { x, y } = empty[i];
    board[y][x] = "creep";
  }

  board[height - 2][width - 2] = "portal";
  return { data: board, width, height };
}
