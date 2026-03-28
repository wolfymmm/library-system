import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: mongoose.Types.ObjectId;
  isbn: string;
  pages?: number;
  writingYear?: number;
  releaseYear?: number;
  description?: string;
  category?: string;
  image?: string;
  stock: Map<string, number>;
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  isbn: { type: String, unique: true, required: true },
  pages: { type: Number },
  writingYear: { type: Number },
  releaseYear: { type: Number },
  description: { type: String },
  category: String,
  image: String,
  stock: { type: Map, of: Number, default: {} }
}, { timestamps: true });

export default mongoose.model<IBook>('Book', BookSchema);