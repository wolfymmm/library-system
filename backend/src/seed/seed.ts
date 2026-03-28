import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Імпорт всіх моделей (обов'язково з .js в кінці)
import User from '../models/User.js';
import Author from '../models/Author.js';
import Book from '../models/Book.js';
import Library from '../models/Library.js';
import Order from '../models/Order.js';

const seedDB = async (): Promise<void> => {
  try {
    // 1. Підключення до бази
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Підключено до MongoDB Atlas...');

    // 2. Очищення старих даних
    await Promise.all([
      User.deleteMany({}),
      Author.deleteMany({}),
      Book.deleteMany({}),
      Library.deleteMany({}),
      Order.deleteMany({})
    ]);
    console.log('🗑️ Старі дані видалено.');

    // 3. Створення Бібліотек (Library)
    const libraries = await Library.insertMany([
      {
        name: 'Літачок',
        address: 'вул. Знань, 4',
        city: 'Львів,',
        phone: '+380442048513',
        image: 'https://lh3.googleusercontent.com/gg/AMW1TPrdgXmOFGqEwTb6NH2FX7fbgfqrBCtHONoA35W94cQOF9jk5F7EpctvxyfocA8ZPGApwQSH2rGEBamXh_U35C8_BD6UxJJ0j6FoEdViT4gYSGZSEwwvH_19DaUWkAxDXHU3HphtQenz-c-0QGatTKMAUvvOPfa6CQ-76jAAxtAStzP2cRC_9U3Z9NfHCOt7CDGqAURAiTz0v6MZZav_7p0hsft_2AWy57odaeoGqc8dJDL3ZdkdTRz-mO8YbbxGaZed1cD0cwtvhZMKhrSs07ZZ85k1t5AQjw5kZOUIUG-CGqOx7PMNkRB662dm9zMdqc-2nYkFTH9Fwp9OZ-7LLlP4=s1600',
        workingHours: 'Пн-Сб: 09:00-20:00'
      },
      {
        name: 'Слово',
        address: 'вул. Антоновича, 50',
        city: 'Київ',
        phone: '+380447898513',
        image: 'https://lh3.googleusercontent.com/gg/AMW1TPrdgXmOFGqEwTb6NH2FX7fbgfqrBCtHONoA35W94cQOF9jk5F7EpctvxyfocA8ZPGApwQSH2rGEBamXh_U35C8_BD6UxJJ0j6FoEdViT4gYSGZSEwwvH_19DaUWkAxDXHU3HphtQenz-c-0QGatTKMAUvvOPfa6CQ-76jAAxtAStzP2cRC_9U3Z9NfHCOt7CDGqAURAiTz0v6MZZav_7p0hsft_2AWy57odaeoGqc8dJDL3ZdkdTRz-mO8YbbxGaZed1cD0cwtvhZMKhrSs07ZZ85k1t5AQjw5kZOUIUG-CGqOx7PMNkRB662dm9zMdqc-2nYkFTH9Fwp9OZ-7LLlP4=s1600',
        workingHours: 'Пн-Пт: 08:30-19:00'
      },
      {
        name: 'Поза часом',
        address: 'вул. Соборна, 40',
        city: 'Фастів',
        phone: '+380442046398',
        image: 'https://lh3.googleusercontent.com/gg/AMW1TPrdgXmOFGqEwTb6NH2FX7fbgfqrBCtHONoA35W94cQOF9jk5F7EpctvxyfocA8ZPGApwQSH2rGEBamXh_U35C8_BD6UxJJ0j6FoEdViT4gYSGZSEwwvH_19DaUWkAxDXHU3HphtQenz-c-0QGatTKMAUvvOPfa6CQ-76jAAxtAStzP2cRC_9U3Z9NfHCOt7CDGqAURAiTz0v6MZZav_7p0hsft_2AWy57odaeoGqc8dJDL3ZdkdTRz-mO8YbbxGaZed1cD0cwtvhZMKhrSs07ZZ85k1t5AQjw5kZOUIUG-CGqOx7PMNkRB662dm9zMdqc-2nYkFTH9Fwp9OZ-7LLlP4=s1600',
        workingHours: 'Пн-Пт: 08:30-19:00'
      }
    ]);

    // 4. Створення Авторів (Author)
    const authors = await Author.insertMany([
      {
        name: 'Орвелл',
        bio: 'Англійський письменник, автор знаменитої антиутопії "1984".',
        country: 'Велика Британія',
        birthDate: new Date('1903-06-25'),
        image: 'https://images.example.com/orwell.jpg'
      },
      {
        name: 'Ліна Костенко',
        bio: 'Українська поетеса-шістдесятниця, почесний професор Могилянки.',
        country: 'Україна',
        birthDate: new Date('1930-03-19'),
        image: 'https://images.example.com/kostenko.jpg'
      }
    ]);

    // 5. Створення Книг (Book) 
    const books = await Book.insertMany([
      {
        title: '1984',
        author: authors[0]._id,
        isbn: '978-0451524935',
        pages: 328,
        writingYear: 1948,
        releaseYear: 1949,
        description: 'Роман про тоталітарне суспільство та Великого Брата.',
        category: 'Антиутопія',
        image: 'https://images.example.com/book-1984.jpg',
        stock: new Map([
          ['Центральна бібліотека ім Шевченка', 5],
          ['Науково-технічна бібліотека КПІ', 2]
        ])
      },
      {
        title: 'Маруся Чурай',
        author: authors[1]._id,
        isbn: '978-9661023450',
        pages: 192,
        writingYear: 1978,
        releaseYear: 1979,
        description: 'Історичний роман у віршах про легендарну співачку.',
        category: 'Поезія',
        image: 'https://images.example.com/marusya.jpg',
        stock: new Map([
          ['Центральна бібліотека ім Шевченка', 3],
          ['Науково-технічна бібліотека КПІ', 10]
        ])
      }
    ]);

    // 6. Створення Користувачів (User) - Хешуємо реальні паролі
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const users = await User.insertMany([
      {
        name: 'Yana',
        email: 'yana@admin.com',
        password: adminPassword,
        phone: '+380951112233',
        address: 'Київ, вул. Політехнічна, 5',
        birthDate: new Date('2004-05-20'),
        role: 'admin',
        orders: []
      },
      {
        name: 'Олексій',
        email: 'oleksii@reader.com',
        password: userPassword,
        phone: '+380674445566',
        address: 'Київ, вул. Саксаганського, 12',
        birthDate: new Date('1998-11-10'),
        role: 'reader',
        orders: []
      }
    ]);

    // 7. Створення Замовлень (Order)
    const orders = await Order.insertMany([
      {
        userId: users[1]._id,
        bookId: books[0]._id,
        delivery: {
          method: 'library_pickup',
          libraryName: 'Науково-технічна бібліотека КПІ',
        },
        status: 'pending', // Статуси мають бути як в моделі (малі літери)
        orderDate: new Date(),
        returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    ]);

    // 8. Оновлюємо зв'язок замовлень у користувача
    await User.findByIdAndUpdate(users[1]._id, {
      $push: { orders: orders[0]._id }
    });

    console.log('✅ База даних успішно заповнена!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Помилка заповнення:', err);
    process.exit(1);
  }
};

seedDB();