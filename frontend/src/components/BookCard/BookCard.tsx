import '../BookCard/BookCard.scss'
import React, { useMemo } from 'react';
import starFull from '../../assets/star-full.svg';
import starEmpty from '../../assets/star-empty.svg';

interface BookProps {
  book: {
    title: string;
    author: string;
    image: string;
  };
}

const BookCard: React.FC<BookProps> = ({ book }) => {
  const rating = useMemo(() => Math.floor(Math.random() * 3) + 3, []);

  return (
    <div className="book-card">
      {/* Якщо в базі тільки назва файлу, додай шлях до папки з картинками */}
      <img src={book.image} alt={book.title} className="book-cover" />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{typeof book.author === 'object' ? book.author.name : book.author}</p>
        <div className="book-rating">
          {[...Array(5)].map((_, index) => (
            <span key={index}>
              <img 
                src={index < rating ? starFull : starEmpty} 
                alt="star" 
                className="star-icon"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookCard;