import type { Request, Response } from 'express';
import Order from '../models/Order.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, bookId, delivery } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({ message: "Книга не знайдена" });
      return;
    }

    if (delivery.method === 'library_pickup' && delivery.libraryName) {
      const currentStock = book.stock.get(delivery.libraryName) || 0;
      
      if (currentStock <= 0) {
        res.status(400).json({ message: "Немає в наявності у цій бібліотеці" });
        return;
      }

      book.stock.set(delivery.libraryName, currentStock - 1);
      await book.save();
    }

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    await User.findByIdAndUpdate(userId, { $push: { orders: savedOrder._id } });

    res.status(201).json(savedOrder);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};