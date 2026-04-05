import './Header.scss';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import searchIcon from '../../assets/Search.svg';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Обробка скролу для зміни стилю хедера
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Блокування скролу body, коли меню відкрите
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // ФУНКЦІЯ ДЛЯ ЗАКРИТТЯ МЕНЮ
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav>
        <div className="nav-top">
          <NavLink to="/" onClick={closeMenu}>
            <img src="./Booksy.svg" alt="Logo" className="logo" />
          </NavLink>

          <form className="search-bar">
            <div className="search-input-wrapper">
                <input type="text" placeholder="Шукати товари чи послуги..." />
                <img src={searchIcon} alt="search" className="search-icon" />
            </div>
            </form>
        {/* Icons Group */}
        <div
          className={`button-group-header ${isMenuOpen ? 'mobile-visible' : ''}`}
        >
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
              <NavLink to="/"end className="nav-link" onClick={closeMenu}>
                Головна
              </NavLink>
            </li>
            <li>
              <NavLink to="/popular" className="nav-link" onClick={closeMenu}>
                Популярне
              </NavLink>
            </li>
            <li>
              <NavLink to="/category" className="nav-link" onClick={closeMenu}>
                Категорія
              </NavLink>
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
