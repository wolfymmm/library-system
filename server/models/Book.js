const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },

  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Author', 
    required: true 
  },
  isbn: { type: String, unique: true, required: true },
  pages: { type: Number },
  writingYear: { type: Number }, 
  releaseYear: { type: Number }, 
  description: { type: String },
  category: String,
  image: String,
  stock: {
    type: Map,
    of: Number,
    default: {} 
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);