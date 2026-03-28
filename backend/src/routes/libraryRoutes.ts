import { Router } from 'express';
import { getLibraries, addLibrary } from '../controllers/library.controller.js';

const router: Router = Router();

router.get('/', getLibraries);
router.post('/', addLibrary);

export default router;