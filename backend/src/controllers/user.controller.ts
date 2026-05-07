import type { Request, Response } from 'express';
import User from '../models/User.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Отримати профіль поточного користувача
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Користувача не знайдено' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// @desc    Оновити профіль
// @route   PUT /api/users/profile
// @desc    Оновити профіль
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, surname, phone, address, birthDate } = req.body;

    // Перевірка: чи всі обов'язкові поля прийшли
    if (!name || !surname || !phone || !address || !birthDate) {
       res.status(400).json({ message: 'Усі поля є обов’язковими' });
       return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      {
        $set: {
          name,
          surname,
          phone,
          address,
          birthDate: new Date(birthDate),
        },
      },
      { new: true, runValidators: true } // new: true повертає оновлений об'єкт
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

// @desc    Видалити користувача (адмін)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'Користувача не знайдено' });
      return;
    }

    // Перевірка видалення самого себе
    if (user._id.toString() === req.user?.id) {
      res.status(400).json({ message: 'Ви не можете видалити самого себе' });
      return;
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'Користувача успішно видалено' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};