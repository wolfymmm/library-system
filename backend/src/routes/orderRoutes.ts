import { Router } from 'express';
import { createOrder } from '../controllers/order.controller.js';

const router: Router = Router();

// POST /api/orders - створити нове замовлення
router.post('/', createOrder);

export default router;