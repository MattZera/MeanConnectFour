// Base node class
class Node {
  possibleMoves = [new MoveNode(0,0,0,0)];

  constructor() {
    this.possibleMoves = [];
  }

  getPossibleMoves() {
    return this.possibleMoves;
  }

  addMoves(moves) {
    moves.forEach((move) => {
      this.possibleMoves.push(new MoveNode(move.getRow(), move.getCol(), move.getHeight(), move.getPlayer()));
    });
  }
}

// Move node stores information about each move
class MoveNode extends Node {
  row = 0;
  col = 0;
  rank = 0;
  height = 0;
  depth = 0;
  player = 0;
  opponent = 0;

  constructor(row, col, height, player) {
    super();
    this.col = col;
    this.row = row;
    this.height = height;
    this.player = player;
    this.opponent = player == 1 ? 2 : 1;
  }

  //Add subsequent moves
  addMoves(moves) {
    moves.forEach((move) => {
      // Move that is the same needs to be moved up a row
      if (row === move.getRow() && col === move.getCol()) {
        if (0 < row) {
          possibleMoves.push(new MoveNode(move.getRow() - 1, move.getCol(), move.getHeight() + 1, opponent));
        }
      } else {
        possibleMoves.push(new MoveNode(move.getRow(), move.getCol(), move.getHeight() + 1, opponent));
      }
    });
  }

  getCol() {
    return this.col;
  }

  getRow() {
    return this.row;
  }

  getHeight() {
    return this.height;
  }

  getPlayer() {
    return this.player;
  }

  getOpponent() {
    return this.opponent;
  }

  getDepth() {
    return this.depth;
  }

  setDepth(depth) {
    this.depth = depth;
  }

  getRank() {
    return this.rank;
  }

  setRank(rank) {
    this.rank = rank;
  }
}

module.exports = {
  Node: Node,
  MoveNode: MoveNode
}
