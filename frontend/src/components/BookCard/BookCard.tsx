import React, { useMemo } from 'react';
import '../BookCard/BookCard.scss';
import starFull from '../../assets/star-full.svg';
import starEmpty from '../../assets/star-empty.svg';
// Імпортуємо тип, який ми щойно виправили в слайсі
import { type Book } from '../../features/books/bookSlice';

export interface BookProps {
  book: Book;
}

const BookCard: React.FC<BookProps> = ({ book }) => {
  // Випадковий рейтинг від 3 до 5 для візуалізації
  const rating = useMemo(() => Math.floor(Math.random() * 3) + 3, []);

  // Визначаємо ім'я автора залежно від того, чи це об'єкт (після populate) чи ID
  const authorName = typeof book.author === 'object' ? book.author.name : 'Невідомий автор';

  return (
    <div className="book-card">
      <div className="book-status">В наявності</div> 
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
    </div>
  );
};

export default BookCard;