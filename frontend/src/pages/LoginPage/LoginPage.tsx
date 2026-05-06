import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      alert('З поверненням!');
      navigate('/'); 
    } catch (error: any) {
      alert(error.response?.data?.message || 'Помилка авторизації');
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
              />
            </div>

            <button type="submit" className="login-btn">
              Увійти
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