import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Інтерфейс для деталей пошти
interface IPostDetails {
  service?: 'Nova Poshta' | 'Ukrposhta';
  region?: string;
  city?: string;
  officeNumber?: string;
}

// 2. Інтерфейс для способу доставки
interface IDelivery {
  method: 'post' | 'library_pickup';
  libraryName?: string;
  postDetails?: IPostDetails;
}

// 3. Головний інтерфейс замовлення
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  delivery: IDelivery;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'returned';
  orderDate: Date;
  returnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 4. Схема
const OrderSchema: Schema<IOrder> = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bookId: { 
    type: Schema.Types.ObjectId, 
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

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;