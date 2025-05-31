// Description: Routes for book-related operations
const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');
const authenticateToken = require('../middleware/auth');

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('GET /books error:', error.message);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// POST a new book (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('POST /books error:', error.message, error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'ISBN already exists' });
    }
    res.status(400).json({ error: error.message || 'Validation failed during book creation' });
  }
});

// GET a book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id error:', error.message);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// PUT update a book by ID (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('PUT /books/:id error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'ISBN already exists' });
    }
    res.status(400).json({ error: error.message || 'Validation failed during book update' });
  }
});

// DELETE a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted' });
  } catch (error) {
    console.error('DELETE /books/:id error:', error.message);
    res.status(400).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;