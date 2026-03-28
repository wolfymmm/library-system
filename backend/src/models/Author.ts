import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Створюємо інтерфейс, який описує структуру документа
export interface IAuthor extends Document {
  name: string;
  bio?: string;      // ? означає, що поле необов'язкове
  country?: string;
  birthDate?: Date;
  image?: string;
  createdAt: Date;   // Автоматично додається завдяки timestamps: true
  updatedAt: Date;
}

// 2. Створюємо схему
const AuthorSchema: Schema<IAuthor> = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  bio: { 
    type: String 
  },
  country: { 
    type: String 
  },
  birthDate: { 
    type: Date 
  },
  image: { 
    type: String 
  }
}, { 
  timestamps: true // Це автоматично керує полями createdAt та updatedAt
});

// 3. Експортуємо модель
const Author: Model<IAuthor> = mongoose.model<IAuthor>('Author', AuthorSchema);
export default Author;