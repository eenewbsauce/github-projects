const schemas = require('./schemas');

module.exports = {
  transformProjectsToBoards: (projects, req, res, cb) => {
    const boards = projects.map((project) => (new schemas.Board(project)));

    cb(null, boards);
  },
  transformBoardToBoardDetail: (board, req, res, cb) => {
    const columns = board.columns.map((column) => {
      column.cards = column.cards.map((card) => (new schemas.Card(card)));

      return new schemas.Column(column);
    });

    board.columns = columns;
    const boardDetail = new schemas.BoardDetail(board);

    cb(null, boardDetail);
  }
};
