import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.scss';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    address: '',
    birthDate: '',
    phone: '',
    email: '',
    password: '' // Тепер порожній, чекаємо вводу
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  let formattedValue = value;

  // Шаблон для телефону: автоматично додаємо +380
  if (name === 'phone') {
    formattedValue = value.replace(/[^\d+]/g, ''); // дозволяємо лише цифри та +
    if (!formattedValue.startsWith('+380')) formattedValue = '+380' + formattedValue.replace('+380', '');
  }

  // Шаблон для дати: додаємо крапки автоматично (00.00.0000)
  if (name === 'birthDate') {
    formattedValue = value.replace(/[^\d]/g, '');
    if (formattedValue.length > 2 && formattedValue.length <= 4) {
      formattedValue = `${formattedValue.slice(0, 2)}.${formattedValue.slice(2)}`;
    } else if (formattedValue.length > 4) {
      formattedValue = `${formattedValue.slice(0, 2)}.${formattedValue.slice(2, 4)}.${formattedValue.slice(4, 8)}`;
    }
  }

  setFormData({ ...formData, [name]: formattedValue });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Стукаємо на виправлений у server.ts ендпоінт
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name: `${formData.name} ${formData.lastName}`,
        email: formData.email,
        password: formData.password, // Відправляємо те, що ввів користувач
        phone: formData.phone,
        address: formData.address,
        birthDate: formData.birthDate
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Реєстрація успішна!');
        navigate('/');
      }
    } catch (error: any) {
      // Виводимо конкретну помилку з бекенду (наприклад: "Email вже існує")
      alert(error.response?.data?.message || 'Сталася помилка при реєстрації');
    }
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <div className="form-wrapper">
          <h1>Вітаємо! 😊</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="input-row">
                <div className="input-group">
                    <label>Ім'я</label>
                    <input type="text" name="name" value={formData.name} placeholder="Ім'я" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Прізвище</label>
                    <input type="text" name="lastName" value={formData.lastName} placeholder="Прізвище" onChange={handleChange} required />
                </div>
                </div>

            <div className="input-group">
              <label>Адреса</label>
              <input type="text" name="address" value={formData.address} placeholder="Ваша адреса" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Дата народження</label>
              <input type="text" name="birthDate" value={formData.birthDate} placeholder="00.00.0000" onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Номер телефону</label>
              <input type="tel" name="phone" value={formData.phone} placeholder="+ xxx..." onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} placeholder="Ваш email" onChange={handleChange} required />
            </div>

            {/* ДОДАЄМО ПОЛЕ ПАРОЛЯ */}
            <div className="input-group">
              <label>Пароль</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                placeholder="Створіть пароль" 
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