import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  birthDate: Date;
  role: 'reader' | 'admin';
  orders: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  birthDate: { type: Date, required: true },
  role: { type: String, enum: ['reader', 'admin'], default: 'reader' },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);