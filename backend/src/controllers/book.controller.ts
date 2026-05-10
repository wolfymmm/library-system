import type { Request, Response } from 'express';
import Book from '../models/Book.js'; 
import Author from '../models/Author.js'; // Додано імпорт моделі автора

// @desc    Допоміжна функція для обробки автора (пошук або створення)
const getOrCreateAuthorId = async (authorName: string | any) => {
  if (typeof authorName !== 'string') return authorName; // Якщо вже прийшов ID

  // Шукаємо автора за іменем (без врахування регістру)
  let authorDoc = await Author.findOne({ 
    name: { $regex: new RegExp(`^${authorName.trim()}$`, 'i') } 
  });

  // Якщо такого автора немає в базі — створюємо новий запис
  if (!authorDoc) {
    authorDoc = await Author.create({ 
      name: authorName.trim(),
      bio: 'Інформація про автора буде додана пізніше.' 
    });
  }

  return authorDoc._id;
};

// @desc    Отримати всі книги
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find().populate('author').sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// @desc    Отримати одну книгу за ID
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

// @desc    Створити нову книгу
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, isbn, category, stock, description, image, pages, releaseYear } = req.body;

    // 1. Перевірка на унікальність ISBN
    const bookExists = await Book.findOne({ isbn });
    if (bookExists) {
      res.status(400).json({ message: "Книга з таким ISBN вже існує" });
      return;
    }

    // 2. Обробка автора (отримуємо ID існуючого або нового)
    const authorId = await getOrCreateAuthorId(author);

    // 3. Збереження книги
    const newBook = new Book({
      title,
      author: authorId,
      isbn,
      category,
      stock,
      description,
      image,
      pages: pages ? Number(pages) : undefined,
      releaseYear: releaseYear ? Number(releaseYear) : undefined
    });

    const savedBook = await newBook.save();
    const populatedBook = await savedBook.populate('author');
    
    res.status(201).json(populatedBook);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

// @desc    Оновити книгу
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // 1. Деструктуризуємо дані: витягуємо автора окремо
    const { author, ...updateData } = req.body;

    let authorId;

    if (author) {
      // 2. Якщо прийшло ім'я автора як рядок, шукаємо або створюємо його в базі авторів
      if (typeof author === 'string') {
        let authorDoc = await Author.findOne({ 
          name: { $regex: new RegExp(`^${author.trim()}$`, 'i') } 
        });

        if (!authorDoc) {
          authorDoc = await Author.create({ name: author.trim() });
        }
        
        authorId = authorDoc._id; // Отримуємо справжній ObjectId
      } else {
        // Якщо раптом прийшов уже об'єкт або ID
        authorId = author._id || author;
      }
    }

    // 3. Тепер оновлюємо книгу, передаючи ВАЛІДНИЙ authorId
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { 
        ...updateData, 
        author: authorId // Замінюємо рядок на ObjectId
      },
      { new: true, runValidators: true }
    ).populate('author');

    if (!updatedBook) {
      res.status(404).json({ message: "Книгу не знайдено" });
      return;
    }

    res.status(200).json(updatedBook);
  } catch (error: any) {
    console.error("Помилка оновлення книги:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Видалити книгу
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