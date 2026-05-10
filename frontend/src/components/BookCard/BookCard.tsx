import React, { useMemo, useState } from 'react';
import '../BookCard/BookCard.scss';
import starFull from '../../assets/star-full.svg';
import starEmpty from '../../assets/star-empty.svg';
import { type Book } from '../../features/books/bookSlice'; // Переконайся, що шлях вірний
import BookModal from '../BookModal/BookModal';

export interface BookProps {
  book: Book;
}

const BookCard: React.FC<BookProps> = ({ book }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const rating = useMemo(() => Math.floor(Math.random() * 3) + 3, []);

  // 1. Обчислюємо загальну кількість книг у всіх бібліотеках
  const totalStock = useMemo(() => {
    if (!book.stock) return 0;
    
    // Якщо stock прийшов як об'єкт (наприклад, після JSON.parse або з Redux)
    const values = Object.values(book.stock);
    return values.reduce((acc: number, count: any) => acc + (Number(count) || 0), 0);
  }, [book.stock]);

  // 2. Визначаємо статус на основі залишку
  const isAvailable = totalStock > 0;

  const authorName = typeof book.author === 'object' ? book.author.name : 'Невідомий автор';

  return (
    <div className={`book-card ${!isAvailable ? 'unavailable' : ''}`} onClick={() => setIsModalOpen(true)}>
      {/* 3. Динамічний статус */}
      <div className={`book-status ${isAvailable ? 'status-available' : 'status-unavailable'}`}>
        {isAvailable ? 'В наявності' : 'Недоступно'}
      </div> 

      <img src={book.image} alt={book.title} className="book-cover" />
      
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{authorName}</p>
        
        <div className="book-rating">
          {[...Array(5)].map((_, index) => (
            <img 
              key={index}
              src={index < rating ? starFull : starEmpty} 
              alt="star" 
              className="star-icon"
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <BookModal book={book} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default BookCard;