const expect = require('chai').expect;
const checkWin = require('../gameLogic').checkWin;

describe("./gameLogic", () => {
  describe("for checkWin", () => {
    it("returns false for empty board", () => {
      const board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ];
      const moveData = checkWin(board, 3, 1);

      expect(moveData).to.deep.equal({
        win: false, row: 5, col: 3
      });
      expect(board).to.deep.equal([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0]
      ]);
    });

    it("returns false for horizontal non win setup board", () => {
      const board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 2, 1, 0, 1, 2, 2]
      ];

      const moveData = checkWin(board, 3, 1);

      expect(moveData).to.deep.equal({
        win: false, row: 5, col: 3
      });
      expect(board).to.deep.equal([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 2, 1, 1, 1, 2, 2]
      ]);
    });

    it("returns true for horizontal win setup board", () => {
      const board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 2, 2, 2]
      ];

      const moveData = checkWin(board, 3, 1);

      expect(moveData).to.deep.equal({
        win: true, row: 5, col: 3
      });
      expect(board).to.deep.equal([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 2, 2, 2]
      ]);
    });

    it("returns true for left diagonal win setup board", () => {
      const board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0],
        [2, 1, 1, 0, 0, 0, 0],
        [1, 2, 1, 1, 2, 2, 2]
      ];

      const moveData = checkWin(board, 1, 1);

      expect(moveData).to.deep.equal({
        win: true, row: 3, col: 1
      });
      expect(board).to.deep.equal([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [2, 1, 0, 0, 0, 0, 0],
        [2, 1, 1, 0, 0, 0, 0],
        [1, 2, 1, 1, 2, 2, 2]
      ]);
    });

    it("returns true for right diagonal win setup board", () => {
      const board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 2, 1, 1],
        [0, 1, 1, 2, 1, 2, 2]
      ];

      const moveData = checkWin(board, 5, 2);

      expect(moveData).to.deep.equal({
        win: true, row: 3, col: 5
      });
      expect(board).to.deep.equal([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 2, 1],
        [0, 0, 0, 0, 2, 1, 1],
        [0, 1, 1, 2, 1, 2, 2]
      ]);
    });

    it("returns true for vertical win setup board", () => {
      const board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 2, 0],
        [1, 1, 2, 1, 2, 2, 2]
      ];

      const moveData = checkWin(board, 3, 1);

      expect(moveData).to.deep.equal({
        win: true, row: 2, col: 3
      });
      expect(board).to.deep.equal([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 2, 0],
        [1, 1, 2, 1, 2, 2, 2]
      ]);
    });
  });
});
