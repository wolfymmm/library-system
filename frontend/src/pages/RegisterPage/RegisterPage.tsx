import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.scss';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    address: '',
    birthDate: '',
    phone: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Функція для перетворення дати 31.12.1990 -> 1990-12-31
  const formatDateForServer = (dateStr: string) => {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Маска для телефону
    if (name === 'phone') {
      formattedValue = value.replace(/[^\d+]/g, '');
      if (formattedValue.length > 0 && !formattedValue.startsWith('+380')) {
        formattedValue = '+380' + formattedValue.replace('+380', '');
      }
    }

    // Маска для дати (00.00.0000)
    if (name === 'birthDate') {
      const digits = value.replace(/[^\d]/g, '');
      if (digits.length <= 2) {
        formattedValue = digits;
      } else if (digits.length <= 4) {
        formattedValue = `${digits.slice(0, 2)}.${digits.slice(2)}`;
      } else {
        formattedValue = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
      }
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Форматуємо дату
    const birthDateFormatted = formatDateForServer(formData.birthDate);
    
    // 2. Валідація перед відправкою (щоб не отримати 400 від сервера)
    if (!birthDateFormatted) {
      alert('Будь ласка, введіть повну дату народження (ДД.ММ.РРРР)');
      return;
    }

    // Перевірка інших полів на порожнечу
    const { name, surname, email, password, phone, address } = formData;
    if (!name || !surname || !email || !password || !phone || !address) {
      alert('Будь ласка, заповніть усі обов’язкові поля!');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        surname,
        email,
        password,
        phone,
        address,
        birthDate: birthDateFormatted // Тут лежить рядок YYYY-MM-DD
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Зберігаємо юзера, якого повернув сервер (там вже є поле surname)
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
        
        alert('Реєстрація успішна! 😊');
        navigate('/');
        window.location.reload(); // Примусово оновлюємо, щоб Redux підхопив дані
      }
    } catch (error: any) {
      // Виводимо конкретну причину помилки 400 з сервера
      const serverMessage = error.response?.data?.message || 'Помилка валідації даних';
      alert(`Помилка: ${serverMessage}`);
      console.error("Деталі помилки 400:", error.response?.data);
    }
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <div className="form-wrapper">
          <h1>Створити акаунт 😊</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <div className="input-group">
                <label>Ім'я</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  placeholder="Ваше ім'я" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Прізвище</label>
                <input 
                  type="text" 
                  name="surname" 
                  value={formData.surname} 
                  placeholder="Прізвище" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>Адреса</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                placeholder="Місто, вулиця, будинок" 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Дата народження</label>
              <input 
                type="text" 
                name="birthDate" 
                value={formData.birthDate} 
                placeholder="ДД.ММ.РРРР" 
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>

            <div className="input-group">
              <label>Номер телефону</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                placeholder="+380..." 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                placeholder="example@mail.com" 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Пароль</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                placeholder="Мінімум 6 символів" 
                onChange={handleChange} 
                required 
                minLength={6} 
              />
            </div>

            <button type="submit" className="register-btn">
              Зареєструватися
            </button>
          </form>

          <p className="auth-switch">
            Вже маєте акаунт? <Link to="/login">Увійти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;