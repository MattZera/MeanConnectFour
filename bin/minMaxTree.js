const Node = require("./moveNode.js").Node;

/**
 * Simple tree used to keep track of all moves
 */
class MinMaxTree {
  constructor() {
    this._root = new Node();
  }

  get root() {
    return this._root;
  }
}

module.exports = {
  MinMaxTree: MinMaxTree
}
