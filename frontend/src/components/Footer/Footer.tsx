import './Footer.scss';
import { NavLink } from 'react-router-dom';
import dotIcon from '../../assets/dot.svg'; // Шлях до твого файлу точки

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <nav>
          <div className="nav">
            <NavLink to="/">
              <img src="./Booksy.svg" alt="Logo" className="logo" />
            </NavLink>

            <ul className='footer-nav-links'>
              <li>
                <NavLink to="/" className="footer-nav-link">
                  <img src={dotIcon} alt="dot" className="dot-icon" />
                  Головна
                </NavLink>
              </li>
              <li>
                <NavLink to="/popular" className="footer-nav-link">
                  <img src={dotIcon} alt="dot" className="dot-icon" />
                  Популярне
                </NavLink>
              </li>
              <li>
                <NavLink to="/libraries" className="footer-nav-link">
                  <img src={dotIcon} alt="dot" className="dot-icon" />
                  Наші бібліотеки
                </NavLink>
              </li>
            </ul>
            <div className='copyright'>Copyright © 2026. Усі права захищено.</div>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;