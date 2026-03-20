const mongoose = require('mongoose');

const LibrarySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    default: 'Київ' 
  },
  phone: { 
    type: String 
  },
  workingHours: { 
    type: String, 
    default: 'Пн-Пт: 09:00-18:00' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Library', LibrarySchema);