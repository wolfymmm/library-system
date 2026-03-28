import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authMiddleware.js';

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Доступ заборонено: тільки для адміністраторів' });
  }
};