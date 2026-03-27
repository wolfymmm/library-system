const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  
  delivery: {
    method: { 
      type: String, 
      enum: ['post', 'library_pickup'], 
      required: true 
    },
    
    libraryName: { type: String }, 
    
    postDetails: {
      service: { 
        type: String, 
        enum: ['Nova Poshta', 'Ukrposhta'] 
      },
      region: { type: String },   
      city: { type: String },      
      officeNumber: { type: String } 
    }
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'returned'], 
    default: 'pending' 
  },
  
  orderDate: { type: Date, default: Date.now },
  returnDate: { type: Date } 
  
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);