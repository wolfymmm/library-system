import { Router } from 'express';
import { getAuthors, createAuthor } from '../controllers/author.controller.js';

const router: Router = Router();

router.get('/', getAuthors);
router.post('/', createAuthor);

export default router;