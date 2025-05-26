// Description: Mongoose schema for books
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100 },
  author: { type: String, required: true, maxLength: 50 },
  isbn: { type: String, required: true, unique: true },
  genre: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, maxLength: 500 }
});

module.exports = mongoose.model('Book', bookSchema);