import { Router } from 'express';
import { register } from '../controllers/user.controller.js';

const router: Router = Router();

// POST /api/users/register - реєстрація
router.post('/register', register);

export default router;