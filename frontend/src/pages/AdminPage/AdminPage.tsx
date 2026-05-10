import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks, updateBook, createBook, deleteBook } from '../../features/books/bookSlice'; // Додано екшени
import { fetchAllOrders, updateOrderStatus } from '../../features/order/orderSlice';
import { fetchAllUsers, selectAllUsers, updateProfile, updateUserByAdmin } from '../../features/auth/authSlice';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import BookFormModal from '../../components/BookCRUDModal/BookCRUDModal';
import UserFormModal from '../../components/UserCRUDModal/UserCRUDModal';
import OrderStatusModal from '../../components/OrderStatusModal/OrderStatusModal';
import './AdminPage.scss';
import { fetchAllLibraries } from '../../features/libraries/librariesSlice';

const STAT_ICONS = {
  books: '/Book Open.svg',
  users: '/UserAdmin.svg',
  borrowed: '/BookBorrowed.svg',
  overdue: '/Warning.svg',
};

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  
  const { items: books } = useSelector((state: any) => state.books);
  const { allOrders = [] } = useSelector((state: any) => state.orders || {});
  const allUsers = useSelector(selectAllUsers);
  
  const [activeTab, setActiveTab] = useState('statistics');

  // Модалки
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchAllOrders());
    dispatch(fetchAllUsers());
    dispatch(fetchAllLibraries());
  }, [dispatch]);

  // Функції відкриття
  const openBookModal = (book = null) => {
    setSelectedItem(book);
    setIsBookModalOpen(true);
  };

  const openUserModal = (user = null) => {
    setSelectedItem(user);
    setIsUserModalOpen(true);
  };

  const openStatusModal = (order: any) => {
    setSelectedItem(order);
    setIsStatusModalOpen(true);
  };

  // --- ОБРОБНИКИ ЗБЕРЕЖЕННЯ ТА ВИДАЛЕННЯ ---

const handleSaveBook = async (data: any) => {
  try {
    if (selectedItem) {
      // Очищаємо ID від можливих артефактів (наприклад, :1)
      const cleanId = selectedItem._id.toString().replace(/:1$/, '');
      
      // Відправляємо дані. Бекенд сам розбереться з автором по імені
      await dispatch(updateBook({ id: cleanId, ...data })).unwrap();
    } else {
      // При створенні selectedItem немає
      await dispatch(createBook(data)).unwrap();
    }
    
    setIsBookModalOpen(false);
    setSelectedItem(null); // Важливо очистити після збереження
    // fetchBooks() можна не викликати, бо extraReducers оновлять стор автоматично,
    // але якщо хочеш 100% синхронізації з базою — залиш.
    dispatch(fetchBooks()); 
  } catch (err) {
    console.error("Помилка збереження книги:", err);
    alert(err || "Не вдалося зберегти книгу");
  }
};

  const handleSaveUser = async (data: any) => {
  try {
    if (selectedItem) {
      // Викликаємо спеціальний адмінський екшен з ID обраного юзера
      await dispatch(updateUserByAdmin({ id: selectedItem._id, ...data })).unwrap();
    }
    
    setIsUserModalOpen(false);
    setSelectedItem(null);
    // Після успіху оновлюємо список всіх користувачів
    dispatch(fetchAllUsers()); 
  } catch (err) {
    console.error("Помилка:", err);
    alert("Не вдалося оновити дані користувача");
  }
};

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю книгу?')) {
      try {
        await dispatch(deleteBook(id)).unwrap();
        setIsBookModalOpen(false);
        dispatch(fetchBooks());
      } catch (err) {
        console.error("Помилка при видаленні:", err);
        alert("Не вдалося видалити книгу");
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      setIsStatusModalOpen(false);
      setSelectedItem(null);
      dispatch(fetchAllOrders()); 
    } catch (err) {
      console.error("Помилка оновлення статусу:", err);
      alert("Не вдалося змінити статус замовлення");
    }
  };

  // --- ДОПОМІЖНІ ФУНКЦІЇ ---

  const stats = {
    totalBooks: books.length,
    totalUsers: allUsers.length,
    borrowedBooks: allOrders.filter((o: any) => o.status !== 'returned').length,
    overdueBooks: allOrders.filter((o: any) => {
      const isOverdue = new Date(o.returnDate) < new Date();
      return o.status !== 'returned' && isOverdue;
    }).length,
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="admin-dashboard">
      <Breadcrumbs activeTab={activeTab} />
      <h1 className="admin-title">Панель адміністратора</h1>

      <div className="admin-tabs">
        <button className={activeTab === 'statistics' ? 'active' : ''} onClick={() => setActiveTab('statistics')}>Статистика</button>
        <button className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>Книги</button>
        <button className={activeTab === 'readers' ? 'active' : ''} onClick={() => setActiveTab('readers')}>Читачі</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Позичені книги</button>
      </div>

      {activeTab === 'statistics' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="icon-box books"><img src={STAT_ICONS.books} alt="Books" /></div>
              <div className="stat-info">
                <span className="count">{stats.totalBooks}</span>
                <span className="label">Всього книг</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-box users"><img src={STAT_ICONS.users} alt="Users" /></div>
              <div className="stat-info">
                <span className="count">{stats.totalUsers}</span>
                <span className="label">Користувачів</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-box borrowed"><img src={STAT_ICONS.borrowed} alt="Borrowed" /></div>
              <div className="stat-info">
                <span className="count">{stats.borrowedBooks}</span>
                <span className="label">Позичених книг</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-box overdue"><img src={STAT_ICONS.overdue} alt="Overdue" /></div>
              <div className="stat-info">
                <span className="count overdue-text">{stats.overdueBooks}</span>
                <span className="label">Заборгованості</span>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2 className="section-title">Останні позичені книги</h2>
            <div className="orders-list">
              {allOrders.length > 0 ? (
                allOrders.slice(0, 5).map((order: any) => {
                  const isOverdue = new Date(order.returnDate) < new Date() && order.status !== 'returned';
                  return (
                    <div key={order._id} className="order-item">
                      <img src={order.bookId?.image || "/book-cover-placeholder.png"} alt="" className="book-cover" />
                      <div className="order-details">
                        <p className="book-title">{order.bookId?.title || 'Назва відсутня'}</p>
                        <p className="reader-name">{order.userId?.name} {order.userId?.surname}</p>
                        <p className="reader-phone">{order.userId?.phone}</p>
                      </div>
                      <div className={`status-badge ${isOverdue ? 'overdue' : 'active'}`}>
                        {isOverdue ? 'Прострочено ' : 'Видане до '}
                        {formatDate(order.returnDate)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty-message">Активних замовлень немає.</p>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'books' && (
        <div className="admin-section">
          <div className="section-top-bar">
            <h2>Керування бібліотекою</h2>
            <button className="create-btn" onClick={() => openBookModal()}>+ Створити книгу</button>
          </div>
          <div className="admin-items-grid">
            {books.map((book: any) => (
              <div key={book._id} className="admin-item-card">
                <img src={book.image} alt={book.title} />
                <div className="item-info">
                  <h3>{book.title}</h3>
                  <span>{typeof book.author === 'object' ? book.author.name : 'Автор невідомий'}</span>
                  <button className="edit-item-btn" onClick={() => openBookModal(book)}>Редагувати</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'readers' && (
        <div className="admin-section">
          <div className="section-top-bar">
            <h2>База читачів</h2>
            <button className="create-btn" onClick={() => openUserModal()}>+ Додати читача</button>
          </div>
          <div className="admin-items-grid">
            {allUsers.map((user: any) => (
              <div key={user._id} className="admin-item-card reader">
                <div className="item-info">
                  <div className="card-header">
                    <h3>{user.name} {user.surname}</h3>
                  </div>
                  <div className="user-details">
                    <p>Телефон: {user.phone || '—'}</p>
                    <p>Email: {user.email}</p>
                    <p>Адреса: {user.address || '—'}</p>
                    <p>Дата народження: {user.birthDate ? formatDate(user.birthDate) : '—'}</p>
                  </div>
                  <div className="card-footer">
                    <p className="joined-date">
                      {user.createdAt ? (
                        <><span>На платформі з: </span>{formatDate(user.createdAt)}</>
                      ) : ('Дата реєстрації невідома')}
                    </p>
                    <button className="edit-item-btn" onClick={() => openUserModal(user)}>Редагувати</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-section">
          <div className="section-top-bar">
            <h2>Усі активні замовлення</h2>
          </div>
          <div className="orders-list">
            {allOrders.map((order: any) => (
              <div key={order._id} className="order-item">
                <img src={order.bookId?.image} alt="" className="book-cover" />
                <div className="order-details">
                  <p className="book-title">{order.bookId?.title}</p>
                  <p className="reader-name">{order.userId?.name} {order.userId?.surname}</p>
                  <span className="status" data-status={order.status}>
                    {order.status === 'pending' && 'В обробці'}
                    {order.status === 'confirmed' && 'Підтверджено'}
                    {order.status === 'shipped' && 'Відправлено'}
                    {order.status === 'delivered' && 'На руках'}
                    {order.status === 'returned' && 'Повернуто'}
                  </span>
                </div>
                <button className="edit-item-btn small" onClick={() => openStatusModal(order)}>
                  Змінити статус
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Рендеринг модалок */}
      {isBookModalOpen && (
        <BookFormModal 
          book={selectedItem} 
          onClose={() => setIsBookModalOpen(false)} 
          onSave={handleSaveBook}
          onDelete={handleDeleteBook}
        />
      )}

      {isUserModalOpen && (
        <UserFormModal 
          user={selectedItem} 
          onClose={() => setIsUserModalOpen(false)} 
          onSave={handleSaveUser} // ТУТ ТЕПЕР ВИКЛИКАЄТЬСЯ handleSaveUser
        />
      )}

      {isStatusModalOpen && (
        <OrderStatusModal 
          order={selectedItem} 
          onClose={() => setIsStatusModalOpen(false)} 
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default AdminPage;