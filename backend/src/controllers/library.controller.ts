import type { Request, Response } from 'express';
import Library from '../models/Library.js';
import Book from '../models/Book.js';

// Отримати всі бібліотеки (твій існуючий метод)
export const getLibraries = async (req: Request, res: Response): Promise<void> => {
  try {
    const libraries = await Library.find();
    res.status(200).json(libraries);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// --- НОВИЙ МЕТОД: Бібліотеки, де книга є в наявності ---
export const getAvailableLibrariesForBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;

    // 1. Знаходимо книгу, щоб подивитися її Map зі стоком
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({ message: "Книгу не знайдено" });
      return;
    }

    // 2. Витягуємо назви бібліотек, де кількість книг > 0
    // Оскільки сток — це Map, перетворюємо його на масив і фільтруємо
    const availableLibraryNames = Array.from(book.stock.entries())
      .filter(([_, count]) => count > 0)
      .map(([name, _]) => name);

    // 3. Знаходимо повну інформацію про ці бібліотеки (адреси, години роботи)
    const libraries = await Library.find({ 
      name: { $in: availableLibraryNames } 
    });

    res.status(200).json(libraries);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Додати нову бібліотеку
export const addLibrary = async (req: Request, res: Response): Promise<void> => {
  try {
    const library = new Library(req.body);
    await library.save();
    res.status(201).json(library);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};