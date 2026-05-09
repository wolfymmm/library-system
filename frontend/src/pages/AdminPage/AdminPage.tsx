import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks } from '../../features/books/bookSlice';
import { fetchAllOrders } from '../../features/order/orderSlice';
import { fetchAllUsers, selectAllUsers } from '../../features/auth/authSlice';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './AdminPage.scss';

const STAT_ICONS = {
  books: '/Book Open.svg',
  users: '/User-icon.svg',
  borrowed: '/Borrowed-icon.svg',
  overdue: '/Overdue-icon.svg',
};

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  
  // 1. Отримуємо динамічні дані зі сховища (Store)
  const { items: books } = useSelector((state: any) => state.books);
  const { allOrders = [] } = useSelector((state: any) => state.orders || {});
  const allUsers = useSelector(selectAllUsers);
  
  const [activeTab, setActiveTab] = useState('statistics');

  // 2. Завантажуємо все при монтуванні компонента
  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchAllOrders());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // 3. Динамічний розрахунок статистики
  const stats = {
    totalBooks: books.length,
    totalUsers: allUsers.length, // ТЕПЕР ДИНАМІЧНО
    borrowedBooks: allOrders.filter((o: any) => o.status !== 'returned').length,
    overdueBooks: allOrders.filter((o: any) => {
      // Перевірка на прострочення (якщо дата повернення вже минула, а статус не 'returned')
      const isOverdue = new Date(o.returnDate) < new Date();
      return o.status !== 'returned' && isOverdue;
    }).length,
  };

  // Форматування дати для виводу (DD.MM)
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '--.--';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  return (
    <div className="admin-dashboard">
      <Breadcrumbs />
      <h1 className="admin-title">Панель адміністратора</h1>

      <div className="admin-tabs">
        <button className={activeTab === 'statistics' ? 'active' : ''} onClick={() => setActiveTab('statistics')}>Статистика</button>
        <button className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>Книги</button>
        <button className={activeTab === 'readers' ? 'active' : ''} onClick={() => setActiveTab('readers')}>Читачі</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Позичені книги</button>
      </div>

      {/* Динамічні картки статистики */}
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
            // Беремо останні 5 замовлень для головної сторінки адміна
            allOrders.slice(0, 5).map((order: any) => {
              const isOverdue = new Date(order.returnDate) < new Date() && order.status !== 'returned';
              
              return (
                <div key={order._id} className="order-item">
                  <img 
                    src={order.bookId?.image || "/book-cover-placeholder.png"} 
                    alt={order.bookId?.title} 
                    className="book-cover" 
                  />
                  <div className="order-details">
                    <p className="book-title">
                      {order.bookId?.title || 'Назва відсутня'}
                    </p>
                    <p className="reader-name">
                      {order.userId?.name} {order.userId?.surname}
                    </p>
                    <p className="reader-phone">{order.userId?.phone || 'Телефон не вказано'}</p>
                  </div>
                  <div className={`status-badge ${isOverdue ? 'overdue' : 'active'}`}>
                    {isOverdue 
                      ? `Прострочено ${formatDate(order.returnDate)}` 
                      : `Видане до ${formatDate(order.returnDate)}`}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="empty-message">Активних замовлень у системі поки немає.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;