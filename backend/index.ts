import dotenv from 'dotenv';
import express, { type Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import bookRoutes from './src/routes/bookRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import authorRoutes from './src/routes/authorRoutes.js';
import libraryRoutes from './src/routes/libraryRoutes.js';

dotenv.config();

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ Помилка: MONGO_URI не знайдено в файлі .env");
  process.exit(1);
}

// Підключення до БД
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('🚀 НАРЕШТІ! ПЕРЕМОГА! База підключена!');
})
.catch(err => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.error('❌ Помилка підключення:', message);
});

// Роути
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/libraries', libraryRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`📡 Сервер піднявся на http://localhost:${PORT}`);
});