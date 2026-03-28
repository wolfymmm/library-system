import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Створюємо інтерфейс для даних у токені
interface JwtPayload {
  id: string;
  role: 'reader' | 'admin';
}

// Розширюємо стандартний тип Request, щоб додати туди поле user
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;

  // Токен зазвичай передається як "Bearer <token>" в заголовку Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: 'Немає токена, авторизація відхилена' });
        return;
      }

      // Декодуємо токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      
      // Додаємо дані користувача в об'єкт запиту
      req.user = decoded;
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Токен недійсний' });
    }
  } else {
    res.status(401).json({ message: 'Авторизація відсутня' });
  }
};