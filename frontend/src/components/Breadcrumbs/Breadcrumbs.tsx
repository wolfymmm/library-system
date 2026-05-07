import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.scss';

interface BreadcrumbsProps {
  activeFilter?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeFilter }) => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const isPopularPage = location.pathname === '/popular';

  return (
    <nav className="breadcrumbs-container" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {/* Головна завжди є */}
        <li className="breadcrumb-item">
          <Link to="/">Головна</Link>
        </li>

        {/* Якщо ми в профілі */}
        {isProfilePage && (
          <li className="breadcrumb-item active">
            Особистий кабінет
          </li>
        )}

        {/* Якщо ми в популярному */}
        {isPopularPage && (
          <>
            <li className={`breadcrumb-item ${!activeFilter ? 'active' : ''}`}>
              {activeFilter ? (
                <Link to="/popular">Популярне</Link>
              ) : (
                "Популярне"
              )}
            </li>

            {/* Додатковий рівень для категорій */}
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