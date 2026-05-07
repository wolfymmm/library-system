import type { Request, Response } from 'express';
import Order from '../models/Order.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

// Додаємо інтерфейс для розширеного Request (де є user з middleware protect)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // ВАЖЛИВО: userId тепер беремо з токена (req.user.id), а не з body
    const userId = req.user?.id;
    const { bookId, delivery, duration } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Користувач не авторизований" });
      return;
    }

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({ message: "Книга не знайдена" });
      return;
    }

    // Логіка оновлення стоку для самовивозу
    if (delivery.method === 'library_pickup' && delivery.libraryName) {
      // Використовуємо .get() якщо stock - це Map у Mongoose
      const currentStock = book.stock instanceof Map 
        ? book.stock.get(delivery.libraryName) 
        : (book.stock as any)[delivery.libraryName] || 0;
      
      if (currentStock <= 0) {
        res.status(400).json({ message: "Немає в наявності у цій бібліотеці" });
        return;
      }

      if (book.stock instanceof Map) {
        book.stock.set(delivery.libraryName, currentStock - 1);
      } else {
        (book.stock as any)[delivery.libraryName] = currentStock - 1;
      }
      
      // Помічаємо поле як змінене, якщо це Mixed тип або Map
      book.markModified('stock');
      await book.save();
    }

    // Розрахунок дати повернення на основі обраного терміну (duration)
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + (Number(duration) || 14));

    const newOrder = new Order({
      userId,
      bookId,
      delivery,
      returnDate, // Автоматично додана дата
      status: 'pending',
      orderDate: new Date()
    });

    const savedOrder = await newOrder.save();

    // Додаємо замовлення в масив користувача
    await User.findByIdAndUpdate(userId, { $push: { orders: savedOrder._id } });

    res.status(201).json(savedOrder);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error("Order Error:", message);
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
    ).populate('bookId', 'title image'); // Додав image для фронтенда

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

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: "Замовлення не знайдено" });
      return;
    }

    // Повернення книги в stock при видаленні замовлення
    if (order.delivery.method === 'library_pickup' && order.delivery.libraryName) {
      const book = await Book.findById(order.bookId);
      if (book) {
        const currentStock = book.stock instanceof Map 
            ? book.stock.get(order.delivery.libraryName) 
            : (book.stock as any)[order.delivery.libraryName] || 0;
            
        if (book.stock instanceof Map) {
            book.stock.set(order.delivery.libraryName, currentStock + 1);
        } else {
            (book.stock as any)[order.delivery.libraryName] = currentStock + 1;
        }
        
        book.markModified('stock');
        await book.save();
      }
    }

    await Order.findByIdAndDelete(id);
    await User.findByIdAndUpdate(order.userId, { $pull: { orders: id } });

    res.status(200).json({ message: "Замовлення видалено, запаси оновлено" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};