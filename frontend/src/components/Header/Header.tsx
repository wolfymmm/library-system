import './Header.scss';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; // Додано useLocation
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import searchIcon from '../../assets/Search.svg';

const CATEGORIES = [
  "Сучасні автори", "Романтична проза", "Дарк романи", 
  "Історична та пригодницька проза", "Детективи", "Фантастика", "Фентезі"
];

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation(); // Отримуємо поточний шлях

  // Перевіряємо, чи ми зараз на сторінці профілю
  const isProfilePage = location.pathname === '/profile';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    navigate('/popular', { state: { selectedCategory: category } });
    closeMenu();
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header__container">
        <nav>
          <div className="nav-top">
            <NavLink to="/" onClick={closeMenu}>
              <img src="/Booksy.svg" alt="Logo" className="logo" />
            </NavLink>

            <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
              <div className="search-input-wrapper">
                <input type="text" placeholder="Шукати за автором книги, назвою..." />
                <img src={searchIcon} alt="search" className="search-icon" />
              </div>
            </form>

            {/* Приховуємо групу кнопок, якщо ми в профілі */}
            <div className={`button-group-header ${isMenuOpen ? 'mobile-visible' : ''}`}>
              <div className="button-group-header-block">
                <NavLink to="/favorites" onClick={closeMenu}>
                  <img src="/Heart.svg" alt="Heart" className="heart" />
                </NavLink>
              </div>
              
              <div className="button-group-header-block">
                <NavLink to={isAuthenticated ? "/profile" : "/login"} onClick={closeMenu}>
                  <img src="/Profile.svg" className="profile" alt="Profile" />
                </NavLink>
              </div>
            </div>
          </div>

          {/* Приховуємо всю нижню навігацію з категоріями, якщо ми в профілі */}
          {!isProfilePage && (
            <div className='nav-bottom'>
              <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <li>
                  <NavLink to="/" end className="nav-link" onClick={closeMenu}>
                    Головна
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/popular" className="nav-link" onClick={closeMenu}>
                    Популярне
                  </NavLink>
                </li>
                
                <li 
                  className="nav-item dropdown"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <span className={`nav-link ${isDropdownOpen ? 'active' : ''}`}>
                    Категорія
                    <span className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}></span>
                  </span>
                  
                  {isDropdownOpen && (
                    <ul className="dropdown-menu">
                      {CATEGORIES.map((category) => (
                        <li 
                          key={category} 
                          className="dropdown-item"
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li>
                  <NavLink to="/libraries" className="nav-link" onClick={closeMenu}>
                    Наші бібліотеки
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;