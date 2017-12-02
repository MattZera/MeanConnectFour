const expect = require('chai').expect;
const AILogic = require('../aiLogic.js').AILogic;

describe("./aiLogic", () => {
  describe("for AILogic", () => {
    let board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
    let player = 1;
    let ai = new AILogic(board, player);

    it("returns correct player", () => {
      const aiPlayer = ai.player;
      expect(aiPlayer).to.equal(player);
    });

    it("returns correct oppnent", () => {
      const aiOpponent = ai.opponent;
      expect(aiOpponent).to.equal(2 - player + 1);
    });

    it("returns correct possible moves for empty board", () => {
      const possibleMoves = ai.possibleMoves;
      let cols = [];
      possibleMoves.forEach((move) => {
        cols.push(move.col);
      });

      expect(cols).to.deep.equal([0, 1, 2, 3, 4, 5, 6]);
    });

    it("returns correct rank for move on empty board", () => {
      const possibleMoves = ai.possibleMoves;
      ai.computeRank(possibleMoves[0], player, board);
      const rank = possibleMoves[0].rank;

      expect(rank).to.equal(0);
    });

    it("returns any column on an empty board", () => {
      const move = ai.computeMove(ai.tree.root, board);

      expect([0, 1, 2, 3, 4, 5, 6]).to.contain(move.col);
    });

    it("returns column 3 on horizontal win board", () => {
      board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 2, 2, 0]
      ];
      ai = new AILogic(board, player);
      const move = ai.computeMove(ai.tree.root, board);

      expect(move.col).to.equal(3);
    });

    it("returns column 3 on horizontal lose board", () => {
      board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [1, 2, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 2, 2, 2]
      ];
      ai = new AILogic(board, player);
      const move = ai.computeMove(ai.tree.root, board);

      expect(move.col).to.equal(3);
    });

    it("returns column 2 on horizontal near win board", () => {
      board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 2, 2]
      ];
      ai = new AILogic(board, player);
      const move = ai.computeMove(ai.tree.root, board);

      expect(move.col).to.equal(2);
    });

    it("returns column 2 or 6 on a board opponent doing better", () => {
      board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 2, 0, 0, 0, 2]
      ];
      ai = new AILogic(board, player);
      const move = ai.computeMove(ai.tree.root, board);

      expect([2, 6]).to.contain(move.col);
    });

    it("returns column 2 on opponent near win board", () => {
      board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 1, 2, 0, 1, 0, 0],
        [1, 1, 2, 0, 2, 0, 2]
      ];
      ai = new AILogic(board, player);
      const move = ai.computeMove(ai.tree.root, board);

      expect(move.col).to.equal(2);
    });

    it("returns column 3 on board with column 3 open", () => {
      board = [
        [0, 0, 0, 0, 0, 0, 0],
        [1, 2, 2, 0, 1, 2, 1],
        [2, 2, 1, 0, 2, 1, 1],
        [1, 1, 2, 0, 2, 1, 2],
        [2, 2, 1, 0, 1, 1, 2],
        [1, 1, 2, 0, 1, 2, 2]
      ];
      ai = new AILogic(board, player);
      const move = ai.computeMove(ai.tree.root, board);

      expect(move.col).to.equal(3);
    });

    it("returns column 0 on board with one space open", () => {
      board = [
        [0, 1, 2, 1, 1, 2, 1],
        [1, 2, 2, 2, 1, 2, 1],
        [2, 2, 1, 1, 2, 1, 1],
        [1, 1, 2, 2, 2, 1, 2],
        [2, 2, 1, 2, 1, 1, 2],
        [1, 1, 2, 2, 1, 2, 2]
      ];
      ai = new AILogic(board, player);
      const move = ai.computeMove(ai.tree.root, board);

      expect(move.col).to.equal(0);
    });

    it("returns column 2 on vertical win board, where opponent could also win", () => {
      board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 2, 0, 0],
        [0, 0, 1, 0, 2, 0, 0],
        [0, 0, 1, 0, 2, 0, 0]
      ];
      ai = new AILogic(board, player);
      const move = ai.computeMove(ai.tree.root, board);

      expect(move.col).to.equal(2);
    });

    it("returns a column besides column 3, don't want to lose the win", () => {
      board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 2, 1, 0],
        [0, 0, 0, 0, 1, 2, 0],
        [1, 1, 2, 0, 2, 1, 0],
        [2, 2, 1, 0, 2, 2, 0]
      ];
      ai = new AILogic(board, player);
      const move = ai.computeMove(ai.tree.root, board);

      expect(move.col).to.not.equal(3);
    });
  });
});
