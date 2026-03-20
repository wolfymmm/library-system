require('dotenv').config();
const mongoose = require('mongoose');

// Імпорт всіх моделей
const User = require('./models/User');
const Author = require('./models/Author');
const Book = require('./models/Book');
const Library = require('./models/Library');
const Order = require('./models/Order');

const seedDB = async () => {
  try {
    // 1. Підключення до бази
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('🌱 Підключено до MongoDB Atlas...');

    // 2. Очищення старих даних
    await User.deleteMany({});
    await Author.deleteMany({});
    await Book.deleteMany({});
    await Library.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Старі дані видалено.');

    // 3. Створення Бібліотек (Library)
    // УВАГА: Прибрано крапки з "ім. Шевченка" -> "ім Шевченка"
    const libraries = await Library.insertMany([
      {
        name: 'Центральна бібліотека ім Шевченка',
        address: 'вул. Володимирська, 62',
        city: 'Київ',
        phone: '+380442345678',
        workingHours: 'Пн-Сб: 09:00-20:00'
      },
      {
        name: 'Науково-технічна бібліотека КПІ',
        address: 'проспект Берестейський, 37',
        city: 'Київ',
        phone: '+380442048275',
        workingHours: 'Пн-Пт: 08:30-19:00'
      }
    ]);

    // 4. Створення Авторів (Author)
    const authors = await Author.insertMany([
      {
        name: 'Джордж Орвелл',
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
        // Ключі Map не повинні містити крапок
        stock: {
          'Центральна бібліотека ім Шевченка': 5,
          'Науково-технічна бібліотека КПІ': 2
        }
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
        stock: {
          'Центральна бібліотека ім Шевченка': 3,
          'Науково-технічна бібліотека КПІ': 10
        }
      }
    ]);

    // 6. Створення Користувачів (User)
    const users = await User.insertMany([
      {
        name: 'Yana',
        email: 'yana@admin.com',
        password: 'hashed_password_123',
        phone: '+380951112233',
        address: 'Київ, вул. Політехнічна, 5',
        birthDate: new Date('2004-05-20'),
        role: 'admin',
        orders: []
      },
      {
        name: 'Олексій',
        email: 'oleksii@reader.com',
        password: 'hashed_password_456',
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
          postDetails: null 
        },
        status: 'confirmed',
        orderDate: new Date(),
        returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        userId: users[1]._id,
        bookId: books[1]._id,
        delivery: {
          method: 'post',
          postDetails: {
            service: 'Nova Poshta',
            region: 'Київська область',
            city: 'Київ',
            officeNumber: 'Відділення №10'
          }
        },
        status: 'shipped',
        orderDate: new Date()
      }
    ]);

    // 8. Оновлюємо зв'язок замовлень у користувача
    await User.findByIdAndUpdate(users[1]._id, {
      $push: { orders: { $each: [orders[0]._id, orders[1]._id] } }
    });

    console.log('✅ База даних успішно заповнена всіма полями!');
    process.exit();
  } catch (err) {
    console.error('❌ Помилка заповнення:', err);
    process.exit(1);
  }
};

seedDB();