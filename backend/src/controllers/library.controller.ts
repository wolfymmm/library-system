import type { Request, Response } from 'express';
import Library from '../models/Library.js';

export const getLibraries = async (req: Request, res: Response): Promise<void> => {
  try {
    const libraries = await Library.find();
    res.status(200).json(libraries);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

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