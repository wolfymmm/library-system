import './Footer.scss';
import { NavLink } from 'react-router-dom';

function Footer() {

  return (
    <footer className='footer'>
      <nav>
        <div className="nav-left">
          <NavLink to="/">
            <img src="./Booksy.svg" alt="Logo" className="logo" />
          </NavLink>

          <ul className='footer-nav-links'>
            <li>
              <NavLink to="/" className="footer-nav-link">
                Головна
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className="footer-nav-link">
                Популярне
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className="footer-nav-link">
                Категорія
              </NavLink>
            </li>
             <li>
              <NavLink to="/" className="footer-nav-link">
                Наші бібліотеки
              </NavLink>
            </li>
          </ul>
          <div className='copyright'>Copyright © 2026. Усі права захищено.</div>
          </div>
      </nav>
    </footer>
  );
}

export default Footer;
