const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  bio: { type: String },
  country: { type: String },
  birthDate: { type: Date },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Author', AuthorSchema);