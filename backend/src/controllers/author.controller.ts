import type { Request, Response } from 'express';
import Author from '../models/Author.js';

export const getAuthors = async (req: Request, res: Response): Promise<void> => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};