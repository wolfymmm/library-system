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

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('bookId', 'title');

    if (!updatedOrder) {
      res.status(404).json({ message: "Замовлення не знайдено" });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

// @desc    Видалити замовлення (тільки адмін)
// @route   DELETE /api/orders/:id
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Знаходимо замовлення, щоб знати, чи треба повертати книгу в stock
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: "Замовлення не знайдено" });
      return;
    }

    // Важливо: якщо замовлення видаляється, можливо, треба повернути книгу в бібліотеку?
    // Якщо хочеш автоматичне повернення стоку:
    if (order.delivery.method === 'library_pickup' && order.delivery.libraryName) {
      const book = await Book.findById(order.bookId);
      if (book) {
        const currentStock = book.stock.get(order.delivery.libraryName) || 0;
        book.stock.set(order.delivery.libraryName, currentStock + 1);
        await book.save();
      }
    }

    await Order.findByIdAndDelete(id);
    
    // Також варто видалити замовлення зі списку замовлень користувача
    await User.findByIdAndUpdate(order.userId, { $pull: { orders: id } });

    res.status(200).json({ message: "Замовлення видалено, запаси оновлено" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};