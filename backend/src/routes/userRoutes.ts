import { Router } from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  deleteUser,
  getAllUsers,
  updateUserByAdmin
} from '../controllers/user.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js'; 

const router: Router = Router();

// Користувацькі маршрути
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Адмінські маршрути
router.delete('/:id', protect, adminOnly, deleteUser); 
router.get('/', protect, adminOnly, getAllUsers); 
router.put('/:id', protect, adminOnly, updateUserByAdmin);


export default router;