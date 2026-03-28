import mongoose, { Schema, Document } from 'mongoose';

export interface ILibrary extends Document {
  name: string;
  address: string;
  city: string;
  phone?: string;
  image?: string;
  workingHours: string;
}

const LibrarySchema = new Schema<ILibrary>({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, default: 'Київ' },
  phone: { type: String },
  image: String,
  workingHours: { type: String, default: 'Пн-Пт: 09:00-18:00' }
}, { timestamps: true });

export default mongoose.model<ILibrary>('Library', LibrarySchema);