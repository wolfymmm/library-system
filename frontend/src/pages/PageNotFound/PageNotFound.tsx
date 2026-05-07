import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageNotFound.scss';

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__container">
        {/* Ліва частина з текстом */}
        <div className="not-found__content">
          <h1 className="not-found__title">404 Error</h1>
          <p className="not-found__text">
            Упс! Здається, ця сторінка загубилася серед книжкових полиць.
          </p>
          <div className="not-found__actions">
            <button 
              className="btn btn--primary" 
              onClick={() => navigate('/')}
            >
              На головну
            </button>
            <button 
              className="btn btn--outline" 
              onClick={() => navigate(-1)}
            >
              Повернутися назад
            </button>
          </div>
        </div>

        {/* Права частина з картинкою та сяйвом */}
        <div className="not-found__visual">
          <div className="not-found__glow-circle"></div>
          <img 
            src="/Pig404.svg" 
            alt="404 Illustration" 
            className="not-found__image" 
          />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;