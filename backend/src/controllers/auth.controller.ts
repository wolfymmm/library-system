import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Функція для генерації токена
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

// @desc    Реєстрація нового користувача
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. ДЕСТРУКТУРИЗАЦІЯ: Додаємо surname та birthDate з тіла запиту
    const { name, surname, email, password, phone, address, birthDate } = req.body;

    // 2. ВАЛІДАЦІЯ: Перевіряємо чи всі обов'язкові поля присутні
    if (!name || !surname || !email || !password || !phone || !address || !birthDate) {
      res.status(400).json({ message: 'Будь ласка, заповніть усі обов’язкові поля' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'Користувач з таким email вже існує' });
      return;
    }

    // Хешуємо пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. СТВОРЕННЯ: Записуємо ВСІ поля в базу
    const user = await User.create({
      name,
      surname,    // ВАЖЛИВО: додано
      email,
      password: hashedPassword,
      phone,
      address,
      birthDate: new Date(birthDate), // ВАЖЛИВО: конвертуємо в об'єкт Date
      role: 'reader'
    });

    // 4. ВІДПОВІДЬ: Повертаємо об'єкт з новими полями
    res.status(201).json({
      _id: user._id,
      name: user.name,
      surname: user.surname, // Повертаємо на фронтенд
      email: user.email,
      role: user.role,
      birthDate: user.birthDate,
      token: generateToken(user._id.toString(), user.role)
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ message });
  }
};

// @desc    Авторизація користувача (Логін)
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        surname: user.surname, // Обов'язково додаємо прізвище тут
        email: user.email,
        role: user.role,
        birthDate: user.birthDate,
        token: generateToken(user._id.toString(), user.role)
      });
    } else {
      res.status(401).json({ message: 'Невірний email або пароль' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ message });
  }
};