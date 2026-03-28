import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email вже зайнятий" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address
    });

    await newUser.save();
    res.status(201).json({ message: "Користувач створений" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};