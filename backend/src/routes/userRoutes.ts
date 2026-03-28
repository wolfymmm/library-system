import { Router } from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  deleteUser 
} from '../controllers/user.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js'; 

const router: Router = Router();

// Користувацькі маршрути
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Адмінські маршрути
router.delete('/:id', protect, adminOnly, deleteUser); 

export default router;