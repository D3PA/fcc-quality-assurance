'use strict';

const {
  getAllBooks,
  createBook,
  getBookById,
  addComment,
  deleteBook,
  deleteAllBooks
} = require('../controllers/bookController');

module.exports = function (app) {

  app.route('/api/books')
    .get(getAllBooks)
    .post(createBook)
    .delete(deleteAllBooks);

  app.route('/api/books/:id')
    .get(getBookById)
    .post(addComment)
    .delete(deleteBook);
};