import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Інтерфейс даних у токені
interface JwtPayload {
  id: string;
  role: 'reader' | 'admin';
}

// Розширюємо тип Request
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // 1. Перевірка наявності заголовка Authorization
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Доступ заборонено: токен відсутній' });
    return;
  }

  try {
    // 2. Перевірка наявності JWT_SECRET
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('❌ Помилка: JWT_SECRET не визначено в .env');
      res.status(500).json({ message: 'Помилка конфігурації сервера' });
      return;
    }

    // 3. Верифікація токена
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // 4. Додавання даних у запит
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error: any) {
    // 5. Детальна обробка помилок JWT
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Термін дії токена закінчився, увійдіть знову' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Недійсний токен, авторизація відхилена' });
    } else {
      res.status(401).json({ message: 'Помилка авторизації' });
    }
  }
};