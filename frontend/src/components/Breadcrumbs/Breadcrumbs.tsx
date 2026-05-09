import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.scss';

interface BreadcrumbsProps {
  activeFilter?: string; // Для популярного
  activeTab?: string;    // Додано для адмінки
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeFilter, activeTab }) => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const isPopularPage = location.pathname === '/popular';
  const isAdminPage = location.pathname === '/admin';

  // Мапа для перекладу вкладок адмінки
  const adminTabsLabels: Record<string, string> = {
    statistics: 'Статистика',
    books: 'Керування книгами',
    readers: 'База читачів',
    orders: 'Позичені книги',
  };

  return (
    <nav className="breadcrumbs-container" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        <li className="breadcrumb-item">
          <Link to="/">Головна</Link>
        </li>

        {/* --- АДМІН-ПАНЕЛЬ --- */}
        {isAdminPage && (
          <>
            <li className={`breadcrumb-item ${!activeTab ? 'active' : ''}`}>
               {activeTab ? <Link to="/admin">Панель адміністратора</Link> : "Панель адміністратора"}
            </li>
            {activeTab && adminTabsLabels[activeTab] && (
              <li className="breadcrumb-item active">
                {adminTabsLabels[activeTab]}
              </li>
            )}
          </>
        )}

        {/* --- ОСОБИСТИЙ КАБІНЕТ --- */}
        {isProfilePage && (
          <li className="breadcrumb-item active">
            Особистий кабінет
          </li>
        )}

        {/* --- ПОПУЛЯРНЕ --- */}
        {isPopularPage && (
          <>
            <li className={`breadcrumb-item ${!activeFilter ? 'active' : ''}`}>
              {activeFilter ? (
                <Link to="/popular">Популярне</Link>
              ) : (
                "Популярне"
              )}
            </li>
            {activeFilter && (
              <li className="breadcrumb-item active">
                {activeFilter}
              </li>
            )}
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;