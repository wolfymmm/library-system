import { Router } from 'express';
import { getBooks, getBookById, createBook } from '../controllers/book.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router: Router = Router();

// GET /api/books - отримати всі книги
router.get('/', getBooks);
// GET /api/books/:id - отримати одну книгу за ID
router.get('/:id', getBookById);

router.post('/', protect, adminOnly, createBook);

export default router;