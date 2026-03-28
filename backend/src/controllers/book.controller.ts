// Використовуємо 'import type' для типів
import type { Request, Response } from 'express';
// 'Book' залишається звичайним імпортом, бо це модель (клас/об'єкт)
import Book from '../models/Book.js'; 

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find().populate('author');
    res.status(200).json(books);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) {
      res.status(404).json({ message: 'Книгу не знайдено' });
      return;
    }
    res.status(200).json(book);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, isbn, category, stock } = req.body;

    // Перевірка, чи така книга вже є (за ISBN)
    const bookExists = await Book.findOne({ isbn });
    if (bookExists) {
      res.status(400).json({ message: "Книга з таким ISBN вже існує" });
      return;
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      stock 
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};


export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // { new: true } повертає вже оновлений об'єкт, а не старий
    // runValidators: true перевіряє дані згідно з нашою схемою Mongoose
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedBook) {
      res.status(404).json({ message: "Книгу не знайдено для оновлення" });
      return;
    }

    res.status(200).json(updatedBook);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

// Видалити книгу
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      res.status(404).json({ message: "Книгу не знайдено для видалення" });
      return;
    }

    res.status(200).json({ message: "Книгу успішно видалено", id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};