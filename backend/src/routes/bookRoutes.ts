import { Router } from 'express';
import { getBooks, getBookById, createBook, updateBook, deleteBook, analyzeBookAI } from '../controllers/book.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router: Router = Router();


router.post('/analyze-ai', analyzeBookAI);
// GET /api/books - отримати всі книги
router.get('/', getBooks);
// GET /api/books/:id - отримати одну книгу за ID
router.get('/:id', getBookById);

router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);



export default router;