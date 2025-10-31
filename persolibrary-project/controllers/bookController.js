'use strict';
require('../db/connection');
const Book = require('../models/book');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}, { comments: 0 }); // voy a excluir comments array para mejorar performance
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.type('text').send('missing required field title');
    }

    const newBook = new Book({ title });
    const savedBook = await newBook.save();
    
    res.json({ _id: savedBook._id, title: savedBook.title });
  } catch (error) {
    res.status(500).json({ error: 'Error creating book' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.type('text').send('no book exists');
    }

    res.json({
      _id: book._id,
      title: book.title,
      comments: book.comments || []
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.type('text').send('no book exists');
    }
    res.status(500).json({ error: 'Error fetching book' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.type('text').send('missing required field comment');
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.type('text').send('no book exists');
    }

    book.comments.push(comment);
    book.commentcount = book.comments.length;
    await book.save();

    res.json({
      _id: book._id,
      title: book.title,
      comments: book.comments
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.type('text').send('no book exists');
    }
    res.status(500).json({ error: 'Error adding comment' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.type('text').send('no book exists');
    }

    res.type('text').send('delete successful');
  } catch (error) {
    if (error.name === 'CastError') {
      return res.type('text').send('no book exists');
    }
    res.status(500).json({ error: 'Error deleting book' });
  }
};

exports.deleteAllBooks = async (req, res) => {
  try {
    await Book.deleteMany({});
    res.type('text').send('complete delete successful');
  } catch (error) {
    res.status(500).json({ error: 'Error deleting all books' });
  }
};