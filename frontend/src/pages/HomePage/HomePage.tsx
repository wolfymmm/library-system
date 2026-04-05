import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../features/books/bookSlice";
import type { RootState, AppDispatch } from "../../app/store";
import BookCard from "../../components/BookCard/BookCard";
import './HomePage.scss'

export default function HomePage() {

  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <p>Завантаження книг...</p>;
  if (status === 'failed') return <p>Помилка: {error}</p>;

  return (
    <>
      <section className="banner-section">
        <div className="banner">
          <div className="banner-left">
          <h1 className="banner-title">Бібліотека у твоїй кишені</h1>
          <text className="banner-text">Обирай книгу до душі та замовляй абсолютно безкоштовно</text>
          <button className='watch-catalog-button'> Переглянути каталог</button>
          </div>
          <div className="banner-right">
          <img src="./books.png" alt="Books picture" className='books-picture' />
          </div>
          </div>
      </section> 
      <section className="popular-section">
        <div className="popular">
          <div className="popular-top">
          <h2 className="popular-title">Популярне зараз</h2>
          <span className="view-all">Показати все</span>
        </div>
          
          <div className="books-grid">
            {items.map((book: any) => (
            <BookCard key={book._id} book={book} />
          ))}
          </div>
        </div>
      </section> 
    </>
  );
}