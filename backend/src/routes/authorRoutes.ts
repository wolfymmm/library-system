import { Router } from 'express';
import { getAuthors } from '../controllers/author.controller.js';

const router: Router = Router();

router.get('/', getAuthors);

export default router;