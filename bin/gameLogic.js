function checkWin(gameBoard, move, player) {
  let row;
  for (row = 5; row >= 0; row--) {
    if (gameBoard[row][move] === 0) {
      gameBoard[row][move] = player;
      break;
    }
  }

  let ranks = {};
  let dirs = ["ul", "l", "dl", "d", "dr", "r", "ur"];

  dirs.forEach((dir) => {
    ranks[dir] = dirRank(player, dir, row, move, 0, -1, gameBoard);
  });

  // Get the maximum rank of all directions
  const leftDiag = ranks["ul"] + ranks["dr"] + 1>= 4;
  const rightDiag = ranks["dl"] + ranks["ur"] + 1>= 4;
  const horiz = ranks["l"] + ranks["r"] + 1>= 4;
  const down = ranks["d"] + 1 >= 4;
  return leftDiag || rightDiag || horiz || down;
}

function dirRank(id, dir, row, col, rank, initial, board) {
  let move = false;
  
  // Move in direction if possible
  switch (dir) {
    case "ul":
      if (row != 0 && col != 0) {
        move = true;
        row--;
        col--;
      }
      break;
    
    case "l":
      if (col != 0) {
        move = true;
        col--;
      }
      break;
      
    case "dl":
      if (row != 5 && col != 0) {
        move = true;
        row++;
        col--;
      }
      break;
      
    case "d":
      if (row != 5) {
        move = true;
        row++;
      }
      break;
      
    case "dr":
      if (row != 5 && col != 6) {
        move = true;
        row++;
        col++;
      }
      break;
      
    case "r":
      if (col != 6) {
        move = true;
        col++;
      }
      break;
      
    case "ur":
      if (row != 0 && col != 6) {
        move = true;
        row--;
        col++;
      }
      break;
  }
  
  // determine initial piece
  if (initial == -1 && move) {
    initial = board[row][col];
  }
  
  // didn't hit edge
  if (move) {
    // Recursively add to rank based on pieces seen
    if (id == initial && board[row][col] == id) {
      return dirRank(id, dir, row, col, rank + 1, initial, board);
    }
  }
  
  return rank;
}

module.exports = {
  checkWin: checkWin
}
