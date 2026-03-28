import { Router } from 'express';
import { createOrder, updateOrder, deleteOrder } from '../controllers/order.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router: Router = Router();

// Створити замовлення може будь-який залогінений користувач
router.post('/', protect, createOrder);

// Редагувати та видаляти — тільки адмін
router.put('/:id', protect, adminOnly, updateOrder);
router.delete('/:id', protect, adminOnly, deleteOrder);

export default router;