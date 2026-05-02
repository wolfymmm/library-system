import './Header.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import searchIcon from '../../assets/Search.svg';
// Імпортуй іконку стрілочки, якщо вона є окремим файлом
// import arrowIcon from '../../assets/arrow-down.svg';

const CATEGORIES = [
  "Сучасні автори", "Романтична проза", "Дарк романи", 
  "Історична та пригодницька проза", "Детективи", "Фантастика", "Фентезі"
];

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Стан для випадаючого списку
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    // Переходимо на сторінку популярного і передаємо категорію в state
    navigate('/popular', { state: { selectedCategory: category } });
    closeMenu();
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav>
        <div className="nav-top">
          <NavLink to="/" onClick={closeMenu}>
            <img src="./Booksy.svg" alt="Logo" className="logo" />
          </NavLink>

          <form className="search-bar">
            <div className="search-input-wrapper">
              <input type="text" placeholder="Шукати за автором книги, назвою..." />
              <img src={searchIcon} alt="search" className="search-icon" />
            </div>
          </form>

          <div className={`button-group-header ${isMenuOpen ? 'mobile-visible' : ''}`}>
            <div className="button-group-header-block">
              <NavLink to="/favorites" onClick={closeMenu}>
                <img src="./Heart.svg" alt="Heart" className="heart" />
              </NavLink>
            </div>
            <div className="button-group-header-block">
              <NavLink to="/profile" onClick={closeMenu}>
                <img src="./Profile.svg" alt="Profile" className="profile" />
              </NavLink>
            </div>
          </div>
        </div>

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
            
            {/* ВИПАДАЮЧИЙ СПИСОК КАТЕГОРІЙ */}
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
      </nav>
    </header>
  );
}

export default Header;