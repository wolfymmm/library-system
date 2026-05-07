import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  updateProfile,
  logout,
  getMe,
  selectCurrentUser,
  selectAuthLoading,
} from '../../features/auth/authSlice';

import type { AppDispatch } from '../../app/store';

import './UserPage.scss';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const ICONS = {
  mail: '/Email.svg',
  phone: '/Phone.svg',
  location: '/Location.svg',
  edit: '/Edit.svg',
  avatar: '/Profile.png',
  book: '/Book Open.svg',      // Додай ці іконки в public
  clock: '/Clock Circle.svg',
  chart: '/ArrowUp.svg',
};

const UserPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectAuthLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    address: '',
    birthDate: '',
  });

  const toInputDate = (dateValue: any) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (!user && !isLoading) {
      dispatch(getMe());
    }
  }, [dispatch, navigate, user, isLoading]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        phone: user.phone || '',
        address: user.address || '',
        birthDate: toInputDate(user.birthDate),
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isFormValid = Object.values(formData).every(val => val && val.toString().trim() !== '');
    
    if (!isFormValid) {
      alert('Будь ласка, заповніть усі обов’язкові поля! ⚠️');
      return;
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      await dispatch(getMe()).unwrap();
      setIsEditing(false);
    } catch (err: any) {
      alert(err || 'Помилка при збереженні');
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        phone: user.phone || '',
        address: user.address || '',
        birthDate: toInputDate(user.birthDate),
      });
    }
    setIsEditing(false);
  };

  if (!user && isLoading) {
    return (
      <div className="user-page-loader">
        <div className="spinner"></div>
        <p>Завантаження профілю...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="user-page">
      <Breadcrumbs />

      <div className="user-page__header">
        <h1 className="welcome-title">Вітаємо, {user.name}!</h1>
        <button type="button" className="logout-btn" onClick={() => { dispatch(logout()); navigate('/login'); }}>
          Вийти
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Картка профілю */}
        <div className="profile-card">
          <div className="avatar-wrapper">
            <img src={ICONS.avatar} alt="User Avatar" />
          </div>

          <div className="profile-info">
            <h2 className="user-name">{user.name} {user.surname}</h2>
            <p className="joined-date">Учасник з березня 2026</p>

            <div className="contacts-list">
              <div className="contact-item">
                <img src={ICONS.mail} alt="Email" />
                <span>{user.email}</span>
              </div>
              <div className="contact-item">
                <img src={ICONS.phone} alt="Phone" />
                <span>{user.phone || '+ 380 (--) --- -- --'}</span>
              </div>
              <div className="contact-item">
                <img src={ICONS.location} alt="Location" />
                <span>{user.address || 'Україна'}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button type="button" className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                <img src={ICONS.edit} alt="" /> Редагувати профіль
              </button>
            ) : (
              <div className="edit-buttons">
                <button type="submit" className="save-btn" disabled={isLoading}>Зберегти</button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>Скасувати</button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon-box read"><img src={ICONS.book} alt="" /></div>
            <div className="stat-text">
              <span className="count">4</span>
              <span className="label">Прочитано книг</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="icon-box current"><img src={ICONS.clock} alt="" /></div>
            <div className="stat-text">
              <span className="count">1</span>
              <span className="label">Зараз читаю</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="icon-box monthly"><img src={ICONS.chart} alt="" /></div>
            <div className="stat-text">
              <span className="count">5</span>
              <span className="label">Книг цього місяця</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          <div className="tabs-nav">
            <button type="button" className="tab-btn active">Профіль користувача</button>
            <button type="button" className="tab-btn">Поточні (1)</button>
            <button type="button" className="tab-btn">Історія (5)</button>
          </div>

          <div className="profile-form">
            <div className="input-group">
              <label>Ім'я</label>
              {isEditing ? (
                <input name="name" value={formData.name} onChange={handleChange} required />
              ) : (
                <div className="input-mock">{user.name}</div>
              )}
            </div>

            <div className="input-group">
              <label>Дата народження</label>
              {isEditing ? (
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
              ) : (
                <div className="input-mock">{user.birthDate ? new Date(user.birthDate).toLocaleDateString('uk-UA') : '—'}</div>
              )}
            </div>

            <div className="input-group">
              <label>Прізвище</label>
              {isEditing ? (
                <input name="surname" value={formData.surname} onChange={handleChange} required />
              ) : (
                <div className="input-mock">{user.surname || '—'}</div>
              )}
            </div>

            <div className="input-group">
              <label>Номер телефону</label>
              {isEditing ? (
                <input name="phone" value={formData.phone} onChange={handleChange} required />
              ) : (
                <div className="input-mock">{user.phone || '—'}</div>
              )}
            </div>

            <div className="input-group">
              <label>Адреса</label>
              {isEditing ? (
                <input name="address" value={formData.address} onChange={handleChange} required />
              ) : (
                <div className="input-mock">{user.address || '—'}</div>
              )}
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="input-mock">{user.email}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserPage;