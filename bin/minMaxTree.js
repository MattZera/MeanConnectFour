const Node = require("./moveNode.js").Node;

/**
 * Simple tree used to keep track of all moves
 */
class MinMaxTree {
  root = new Node();

  constructor() {
    this.root = new Node();
  }

  getRoot() {
    return this.root;
  }
}

module.exports = {
  MinMaxTree: MinMaxTree
}
