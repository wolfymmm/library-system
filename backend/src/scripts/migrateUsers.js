import 'dotenv/config'; 
import mongoose from 'mongoose';
import User from '../models/User.ts'; // Переконайся, що розширення .js, якщо використовуєш ES Modules

const migrate = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error("MONGO_URI не знайдено в .env файлі!");
    }

    console.log('⏳ Підключення до MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Підключено!');

    const result = await User.updateMany(
      { 
        $or: [
          { birthDate: { $exists: false } },
          { surname: { $exists: false } }
        ] 
      }, 
      { 
        $set: { 
          birthDate: new Date("2000-01-01T00:00:00.000Z"),
          surname: "Не вказано" 
        } 
      }
    );

    console.log(`🚀 Міграція завершена!`);
    console.log(`📊 Знайдено: ${result.matchedCount}`);
    console.log(`🔄 Оновлено: ${result.modifiedCount}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Помилка міграції:', err.message);
    process.exit(1);
  }
};

migrate();