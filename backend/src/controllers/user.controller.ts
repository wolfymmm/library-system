import type { Request, Response } from 'express';
import User from '../models/User.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Отримати профіль поточного користувача
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // req.user приходить з нашого authMiddleware (protect)
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
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        // Якщо користувач хоче змінити пароль, його треба знову захешувати
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.default.genSalt(10);
        user.password = await bcrypt.default.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'Користувача не знайдено' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'Користувача не знайдено' });
      return;
    }

    // Забороняємо адміну видалити самого себе (опціонально, але безпечно)
    if (user._id.toString() === (req as any).user.id) {
      res.status(400).json({ message: 'Ви не можете видалити власного адміна' });
      return;
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'Користувача успішно видалено' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};