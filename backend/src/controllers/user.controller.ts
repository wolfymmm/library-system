import type { Request, Response } from 'express';
import User from '../models/User.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * @desc    Отримати профіль поточного користувача
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Користувача не знайдено' });
      return;
    }
    res.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

/**
 * @desc    Оновити власний профіль
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, surname, phone, address, birthDate } = req.body;

    // Перевірка наявності обов'язкових полів
    if (!name || !surname || !phone || !address || !birthDate) {
      res.status(400).json({ message: 'Усі поля є обов’язковими' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      {
        name,
        surname,
        phone,
        address,
        birthDate: new Date(birthDate),
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({ message: 'Користувача не знайдено' });
      return;
    }

    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Оновити будь-якого користувача (Адмін)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUserByAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Якщо в даних є birthDate, приводимо до формату дати
    if (updatedData.birthDate) {
      updatedData.birthDate = new Date(updatedData.birthDate);
    }

    const user = await User.findByIdAndUpdate(
      id, 
      updatedData, 
      { new: true, runValidators: true }
    ).select('-password'); // Важливо: не повертаємо пароль після оновлення
    
    if (!user) {
      res.status(404).json({ message: "Користувача не знайдено" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Помилка сервера при оновленні" });
  }
};

/**
 * @desc    Отримати всіх користувачів (Адмін)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

/**
 * @desc    Видалити користувача (Адмін)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Перевірка видалення самого себе
    if (id === req.user?.id) {
      res.status(400).json({ message: 'Ви не можете видалити самого себе' });
      return;
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ message: 'Користувача не знайдено' });
      return;
    }

    res.json({ message: 'Користувача успішно видалено' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};