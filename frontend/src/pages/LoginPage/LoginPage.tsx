import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../../features/auth/authSlice'; // переконайся, що шлях вірний
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      // Отримуємо дані з бекенду (зазвичай це { user, token })
      const { user, token } = response.data;

      // Відправляємо в Redux (слайс сам запише токен в localStorage)
      dispatch(setCredentials({ user, token }));

      alert('З поверненням!');
      navigate('/profile'); // Перенаправляємо на твою нову сторінку профілю
    } catch (error: any) {
      const message = error.response?.data?.message || 'Помилка авторизації';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="form-wrapper">
          <h1>З поверненням! 😊</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Ваш email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Пароль</label>
              <input 
                type="password" 
                placeholder="Ваш пароль" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>

          <p className="auth-switch">
            Не маєте акаунта? <NavLink to="/register">Зареєструватися</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;