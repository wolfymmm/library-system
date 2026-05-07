import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { type Book } from '../../features/books/bookSlice';
import { createOrder } from '../../features/order/orderSlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import './BookModal.scss';

interface Library {
  _id: string;
  name: string;
  address: string;
  city: string;
}

interface Props {
  book: Book;
  onClose: () => void;
}

const BookModal: React.FC<Props> = ({ book, onClose }) => {
  const dispatch = useDispatch<any>();
  const isAuth = useSelector(selectIsAuthenticated);
  const [step, setStep] = useState(1);
  
  // Дані для замовлення
  const [duration, setDuration] = useState(14);
  const [method, setMethod] = useState<'post' | 'library_pickup'>('library_pickup');
  const [postData, setPostData] = useState({ region: '', city: '', office: '' });
  
  // Стан для бібліотек
  const [availableLibraries, setAvailableLibraries] = useState<Library[]>([]);
  const [selectedLibraryName, setSelectedLibraryName] = useState('');
  const [loadingLibs, setLoadingLibs] = useState(false);

  // Завантажуємо доступні бібліотеки, якщо обрано самовивіз
  useEffect(() => {
    if (step === 2 && method === 'library_pickup') {
      setLoadingLibs(true);
      axios.get(`${import.meta.env.VITE_API_URL}/libraries/available/${book._id}`)
        .then(res => {
          setAvailableLibraries(res.data);
          if (res.data.length > 0) setSelectedLibraryName(res.data[0].name);
        })
        .catch(err => console.error("Помилка завантаження бібліотек:", err))
        .finally(() => setLoadingLibs(false));
    }
  }, [step, method, book._id]);

  const handleBookingClick = () => {
    if (!isAuth) {
      alert('Будь ласка, авторизуйтесь, щоб забронювати книгу');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    // Валідація
    if (method === 'library_pickup' && !selectedLibraryName) {
      alert('Оберіть бібліотеку для отримання');
      return;
    }
    if (method === 'post' && (!postData.city || !postData.office)) {
      alert('Заповніть дані доставки');
      return;
    }

    const orderData = {
      bookId: book._id,
      duration,
      delivery: {
        method,
        libraryName: method === 'library_pickup' ? selectedLibraryName : undefined,
        ...(method === 'post' && {
          postDetails: { 
            service: 'Nova Poshta' as const, 
            region: postData.region, 
            city: postData.city, 
            officeNumber: postData.office 
          }
        })
      }
    };

    await dispatch(createOrder(orderData));
    alert('Замовлення підтверджено! 📚');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>

        {step === 1 ? (
          <div className="book-details">
            <div className="left">
              <img src={book.image} alt={book.title} />
              <div className="status-tag">В наявності</div>
            </div>
            <div className="right">
              <h2>{book.title}</h2>
              <p className="author">{typeof book.author === 'object' ? book.author.name : 'Автор'}</p>
              
              <div className="info-grid">
                <div><span>Кількість сторінок</span><strong>{book.pages || '—'}</strong></div>
                <div><span>Рік видання</span><strong>{book.releaseYear || '—'}</strong></div>
                <div><span>ISBN</span><strong>{book.isbn}</strong></div>
                <div><span>Категорія</span><strong>{book.category || 'Детектив'}</strong></div>
              </div>

              <div className="description">
                <h3>Подробиці книги</h3>
                <p>{book.description}</p>
              </div>

              <button className="main-btn" onClick={handleBookingClick}>Забронювати книгу</button>
            </div>
          </div>
        ) : (
          <div className="order-form">
            <h2>Замовлення книги</h2>
            
            <div className="section">
                <h3>
                    <img src="/Calendar.svg" alt="" className="section-icon" />
                    Термін користування
                </h3>
                <div className="options">
                    {[7, 14, 21].map(d => (
                    <button 
                        key={d} 
                        className={duration === d ? 'active' : ''} 
                        onClick={() => setDuration(d)}
                    >
                        {d} днів
                    </button>
                    ))}
                </div>
                </div>

            <div className="section">
               <h3>
                    <img src="/Delivery.svg" alt="" className="section-icon" />
                    Служба доставки
                </h3>
              <div className={`delivery-option ${method === 'post' ? 'active' : ''}`} onClick={() => setMethod('post')}>
                <img src="/Nova.svg" alt="NP" />
                <span>Нова Пошта</span>
              </div>
              <div className={`delivery-option ${method === 'library_pickup' ? 'active' : ''}`} onClick={() => setMethod('library_pickup')}>
                  <img src="/Home.svg" alt="NP" />
                <span>Самовивіз з бібліотеки</span>
              </div>
            </div>

            {method === 'library_pickup' && (
              <div className="library-select-area">
                {loadingLibs ? (
                  <p>Шукаємо вільні примірники у бібліотеках...</p>
                ) : availableLibraries.length > 0 ? (
                  <div className="input-group">
                    <label>Оберіть доступну бібліотеку:</label>
                    <select 
                      value={selectedLibraryName} 
                      onChange={(e) => setSelectedLibraryName(e.target.value)}
                      className="library-select"
                    >
                      {availableLibraries.map(lib => (
                        <option key={lib._id} value={lib.name}>
                          {lib.name} — {lib.address}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="error-text">На жаль, у Києві зараз немає вільних книг у бібліотеках. Оберіть доставку поштою.</p>
                )}
              </div>
            )}

            {method === 'post' && (
              <div className="address-inputs">
                <input placeholder="Область" value={postData.region} onChange={e => setPostData({...postData, region: e.target.value})} />
                <input placeholder="Місто" value={postData.city} onChange={e => setPostData({...postData, city: e.target.value})} />
                <input placeholder="№ відділення" value={postData.office} onChange={e => setPostData({...postData, office: e.target.value})} />
              </div>
            )}

            <button 
              className="main-btn" 
              onClick={handleSubmit}
              disabled={method === 'library_pickup' && availableLibraries.length === 0}
            >
              Підтвердити замовлення
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookModal;