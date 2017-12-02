const MinMaxTree = require("./minMaxTree.js").MinMaxTree;
const MoveNode = require("./moveNode").MoveNode;

class AILogic {
  constructor(board, player) {
    this._player = player;
    this._opponent = player == 1 ? 2 : 1;
    this.lookAhead = 6;
    this._tree = new MinMaxTree();
    this._possibleMoves = [];

    let open = 0;

    // Get initial moves
    for (let col = 0; col < 7; col++) {
      if (board[0][col] == 0) {
        for (let row = 5; row >= 0; row--) {
          if (board[row][col] == 0) {
            open += row + 1;
            this.possibleMoves.push(new MoveNode(row, col, 1, player));
            break;
          }
        }
      }
    }

    //Adjust lookahead based on open spaces remaining
    //if (open <= 22) lookAhead = 10;
    //else if (open <= 16) lookAhead = 42;

    this.tree.root.addMoves(this.possibleMoves);
  }

  get player() {
    return this._player;
  }

  get opponent() {
    return this._opponent;
  }

  get tree() {
    return this._tree;
  }

  get possibleMoves() {
    return this._possibleMoves;
  }

  computeMove(current, board) {
    let best = Number.MIN_SAFE_INTEGER;
    let bestMoves = [new MoveNode(0, 0, 0, 0)];
    bestMoves = [];

    if (this.possibleMoves.length == 1) {
      return this.possibleMoves[0];
    }

    current.possibleMoves.some((move) => {
      // get rank for each move
      let row = move.row;
      let col = move.col;
      this.computeRank(move, move.player, board);

      // move down the tree if needed
      if (Number.MAX_SAFE_INTEGER != move.rank && move.height < this.lookAhead) {
        move.addMoves(current.possibleMoves);

        if (move.possibleMoves.length > 0) {
          board[row][col] = move.player;
          const m = this.computeMove(move, board);

          // set new rank and depth
          move.rank = m.rank;
          move.depth = m.depth;
          board[row][col] = 0;
        } else {
          move.depth = move.height;
        }
      } else {
        move.depth = move.height;
      }

      let rank = move.rank;

      // Take best move possible
      if (Number.MAX_SAFE_INTEGER != rank) {
        if (rank > best) {
          best = rank;
          bestMoves = [];
          bestMoves.push(move);
        } else if (rank == best) {
          if (bestMoves.length == 0) {
            bestMoves.push(move);
          } else if (move.depth < bestMoves[0].depth) {
            bestMoves = [];
            bestMoves.push(move);
          } else if (rank < 0 && move.depth > bestMoves[0].depth) {
            bestMoves = [];
            bestMoves.push(move);
          } else if (rank >= 0 && move.depth < bestMoves[0].depth) {
            bestMoves = [];
            bestMoves.push(move);
          } else if (move.depth == bestMoves[0].depth) {
            bestMoves.push(move);
          }
        }
      } else {
        best = rank;
        bestMoves = [];
        bestMoves.push(move);
        return true;
      }
    });
    const index = Math.floor(Math.random() * bestMoves.length);
    let ret = bestMoves[index];

    // Subtract best from current except on root
    if (current !== this.tree.root) {
      ret.rank = current.rank - ret.rank;
    }

    // In case of equal moves, choose one
    return ret;
  }

  computeRank(move, id, board) {
    const dirs = ["ul", "l", "dl", "d", "dr", "r", "ur"];
    let pRanks = {};

    const oid = move.opponent;

    // Get rank in each direction
    dirs.forEach((dir) => {
      pRanks[dir] = this.dirRank(id, dir, move.row, move.col, 0, -1, board);
    });

    // Get the maximum rank of all directions
    const leftDiag = this.split("ul", "dr", id, oid, pRanks);
    const rightDiag = this.split("dl", "ur", id, oid, pRanks);
    const horiz = this.split("l", "r", id, oid, pRanks);
    const down = this.downRank(move.row, id, oid, pRanks["d"]);
    const pRank = Math.max(leftDiag, rightDiag, horiz, down);

    move.rank = pRank;
  }

  // Makes adjustments on diagonals and horizonal ranks
  split(dir1, dir2, id, oid, pRanks) {
    let s1 = pRanks[dir1],
      s2 = pRanks[dir2];

    // First adjust single direction
    s1[1] = this.nonSplit(id, oid, s1);
    s2[1] = this.nonSplit(id, oid, s2);

    if (s1[1] == Number.MAX_SAFE_INTEGER || s2[1] == Number.MAX_SAFE_INTEGER) {
      return Number.MAX_SAFE_INTEGER;
    }

    let rank = 0;

    // If pieces are same on both sides accumulate and adjust accordingly
    if (s1[0] == s2[0]) {
      rank = s1[1] + s2[1];

      if (id == s1[0] && rank >= 6) {
        rank = Number.MAX_SAFE_INTEGER;
      } else if (oid == s1[0] && rank >= 3) {
        rank = Number.MAX_SAFE_INTEGER / 2;
      } else if (id == s1[0] && rank <= 4) { // Prevent bad moves
        if (s1[2] != 0 && s2[2] != 0) {
          rank -= rank >= 2 ? 2 : rank;
        }
      } else if (oid == s1[0] && rank <= 2) {
        if (s1[2] != 0 && s2[2] != 0) {
          rank -= rank >= 1 ? 1 : 0;
        }
      } else {
        rank *= 2;
      }
    } else { // Otherwise adjust individually and then accumulate
      // Different amounts if pieces are different or
      // there is board edge or open space
      // prevents bad moves
      if (id == s1[0] && oid == s2[0]) {
        if (s1[1] <= 4 && s1[2] != 0) {
          s1[1] -= s1[1] >= 2 ? 2 : s1[1];
        }

        if (s2[1] <= 2 && s2[2] != 0) {
          s2[1] -= s2[2] >= 1 ? 1 : 0;
        }
      } else if (oid == s1[0] && id == s2[0]) {
        if (s1[1] <= 2 && s1[2] != 0) {
          s1[1] -= s1[1] >= 1 ? 1 : 0;
        }

        if (s2[1] <= 4 && s2[2] != 0) {
          s2[1] -= s2[1] >= 2 ? 2 : s2[1];
        }
      } else {
        if (id == s1[0]) {
          if (-1 == s2[0] && s1[1] <= 4) {
            s1[1] -= 2;
          } else if (0 == s2[0] && s1[1] <= 2) {
            s1[1] -= 1;
          }
        } else if (oid == s1[0]) {
          if (-1 == s2[0] && s1[1] <= 2) {
            s1[1] -= 1;
          }
        }

        if (id == s2[0]) {
          if (-1 == s1[0] && s2[1] <= 4) {
            s2[1] -= 2;
          } else if (0 == s1[0] && s2[1] <= 2) {
            s2[1] -= 1;
          }
        } else if (oid == s2[0]) {
          if (-1 == s1[0] && s2[1] <= 2) {
            s2[1] -= 1;
          }
        }
      }

      rank = s1[1] + s2[1];
    }

    return rank;
  }

  // Adjust the rank when near top, prevents bad moves
  downRank(row, id, oid, s) {
    // Different amounts if pieces below are current players or opponents
    if (id == s[0]) {
      if (s[1] <= 4 && row == 0) {
        return s[1] - 2;
      } else if (s[1] <= 2 && row == 1) {
        return s[1] - 1;
      }
    } else if (oid == s[0]) {
      if (s[1] <= 2 && row == 0) {
        return s[1] - 1;
      } else if (s[1] <= 1 && row == 1) {
        return s[1];
      }
    }

    return this.nonSplit(id, oid, s);
  }

  // Adjusts score for individual directions, forcing wins or block wins
  nonSplit(id, oid, s) {
    let rank = s[1];

    if (id == s[0] && rank >= 6) {
      rank = Number.MAX_SAFE_INTEGER;
    } else if (oid == s[0] && rank >= 3) {
      rank = Number.MAX_SAFE_INTEGER / 2;
    }

    return rank;
  }

  // Gets the rank in a single direction
  dirRank(id, dir, row, col, rank, initial, board) {
    let move = false;
    let last = -1;

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

    // hit edge, no last piece
    if (!move) {
      last = 0;
    } else {
      const oid = id == 1 ? 2 : 1;

      // Recursively add to rank based on pieces seen
      if (id == initial && board[row][col] == id) {
        return this.dirRank(id, dir, row, col, rank + 2, initial, board);
      } else if (oid == initial && board[row][col] == oid) {
        return this.dirRank(id, dir, row, col, rank + 1, initial, board);
      } else {
        last = board[row][col];
      }
    }

    return [initial, rank, last];
  }
}

function callAI(board, playerNum) {
  const ai = new AILogic(board, playerNum);
  const move = ai.computeMove(ai.tree.root, board);
  return move.col;
}

module.exports = {
  AILogic: AILogic,
  callAI: callAI
}
