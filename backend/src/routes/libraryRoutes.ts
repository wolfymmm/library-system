import { Router } from 'express';
import { getLibraries, addLibrary, getAvailableLibrariesForBook } from '../controllers/library.controller.js';

const router: Router = Router();

router.get('/', getLibraries);
router.post('/', addLibrary);
router.get('/available/:bookId', getAvailableLibrariesForBook);

export default router;