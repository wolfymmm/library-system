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
    const { name, surname, email, password, phone, address, birthDate } = req.body;

    if (!name || !surname || !email || !password || !phone || !address || !birthDate) {
      res.status(400).json({ message: 'Будь ласка, заповніть усі обов’язкові поля' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'Користувач з таким email вже існує' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
      phone,
      address,
      birthDate: new Date(birthDate),
      role: 'reader'
    });

    // --- ВИПРАВЛЕНО: Додано phone та address у відповідь ---
    res.status(201).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,      // ТЕПЕР БУДЕ В СТОРІ ВІДРАЗУ
      address: user.address,  // ТЕПЕР БУДЕ В СТОРІ ВІДРАЗУ
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
      // --- ВИПРАВЛЕНО: Додано ВСІ поля у відповідь логіну ---
      res.json({
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,      // ДОДАНО
        address: user.address,  // ДОДАНО
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