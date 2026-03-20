require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Перевірка наявності URI (просто для контролю)
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("❌ Помилка: MONGO_URI не знайдено в файлі .env");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  family: 4, // Тільки IPv4
  serverSelectionTimeoutMS: 10000, // Чекати 10 секунд перед помилкою
})
.then(() => {
  console.log('🚀 НАРЕШТІ! ПЕРЕМОГА! База підключена!');
})
.catch(err => {
  console.error('❌ Помилка підключення:', err.message);
  console.log('Спробуй вимкнути Антивірус/Брандмауер Windows на 1 хвилину для перевірки.');
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`📡 Сервер піднявся на http://localhost:${PORT}`);
});