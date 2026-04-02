interface BookProps {
  book: {
    title: string;
    author: string;
    image: string;
  };
}

const BookCard: React.FC<BookProps> = ({ book }) => {
  return (
    <div className="book-card">
      {/* Якщо в базі тільки назва файлу, додай шлях до папки з картинками */}
      <img src={book.image} alt={book.title} className="book-cover" />
      <div className="book-info">
        <h3>{book.title}</h3>
        <p>{typeof book.author === 'object' ? book.author.name : book.author}</p>
      </div>
    </div>
  );
};

export default BookCard;