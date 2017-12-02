// Base node class
class Node {
  constructor() {
    this._possibleMoves = [];
  }

  get possibleMoves() {
    return this._possibleMoves;
  }

  addMoves(moves) {
    moves.forEach((move) => {
      this.possibleMoves.push(new MoveNode(move.row, move.col, move.height, move.player));
    });
  }
}

// Move node stores information about each move
class MoveNode extends Node {
  constructor(row, col, height, player) {
    super();
    this._col = col;
    this._row = row;
    this._rank = 0;
    this._height = height;
    this._depth = 0;
    this._player = player;
    this._opponent = player == 1 ? 2 : 1;
  }

  //Add subsequent moves
  addMoves(moves) {
    moves.forEach((move) => {
      // Move that is the same needs to be moved up a row
      if (this.row === move.row && this.col === move.col) {
        if (0 < this.row) {
          this.possibleMoves.push(new MoveNode(move.row - 1, move.col, move.height + 1, this.opponent));
        }
      } else {
        this.possibleMoves.push(new MoveNode(move.row, move.col, move.height + 1, this.opponent));
      }
    });
  }

  get col() {
    return this._col;
  }

  get row() {
    return this._row;
  }

  get height() {
    return this._height;
  }

  get player() {
    return this._player;
  }

  get opponent() {
    return this._opponent;
  }

  get depth() {
    return this._depth;
  }

  set depth(depth) {
    this._depth = depth;
  }

  get rank() {
    return this._rank;
  }

  set rank(rank) {
    this._rank = rank;
  }
}

module.exports = {
  Node: Node,
  MoveNode: MoveNode
}
