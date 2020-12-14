import Random from "../utils/random";

function findEmptyTiles(board) {
  return board.reduce((result, row, y) => result.concat(row.map((value, x) => {
    if(value === "background-tile") {
      return {x, y}
    }
    return undefined;
  })), []).filter(v => !!v)
}

function fillEmptyTilesRandomically(board, tileName, occupation) {
  let empty = Random.shuffleArray(findEmptyTiles(board))
  let maximum = Math.floor(empty.length * occupation);

  for (let i = 0; i < maximum; ++i) {
    const { x, y } = empty[i];
    board[y][x] = tileName;
  }
}

export default function boardGenerator(level, width, height) {
  let board = [];
  for (let y = 0; y < height; ++y) {
    let row = [];
    for (let x = 0; x < width; ++x) {
      if (x == 0 || x + 1 == width || y == 0 || y + 1 == height) {
        row.push("solid-block");
      } else if ((x + 1) % 2 && (y + 1) % 2) {
        row.push("solid-block");
      } else if (x <= 2 && y <= 2) {
        row.push("bomberman");
      } else {
        row.push("background-tile");
      }
    }
    board.push(row);
  }

  fillEmptyTilesRandomically(board, "explodable-block", 0.4)
  fillEmptyTilesRandomically(board, "creep", 0.4)

  board[height - 2][width - 2] = "portal";
  return { data: board, width, height };
}
