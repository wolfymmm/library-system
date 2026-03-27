const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  phone: { type: String, required: true },
  address: { type: String, required: true },
  birthDate: { type: Date },  
  
  role: { 
    type: String, 
    enum: ['reader', 'admin'], 
    default: 'reader' 
  },
  
  orders: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);