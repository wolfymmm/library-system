import React, { useState, useEffect } from 'react';
import './UserCRUDModal.scss';

interface UserFormProps {
  user?: any;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
}

const UserFormModal: React.FC<UserFormProps> = ({ user, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    birthDate: ''
  });

  useEffect(() => {
    if (user) {
      // Для <input type="date" /> формат має бути YYYY-MM-DD
      const formattedDate = user.birthDate ? user.birthDate.split('T')[0] : '';

      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        birthDate: formattedDate
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content form-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <h2>{user ? 'Редагувати профіль' : 'Реєстрація читача'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-group">
              <label>Ім'я</label>
              <input 
                placeholder="Ім'я" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Прізвище</label>
              <input 
                placeholder="Прізвище" 
                value={formData.surname} 
                onChange={e => setFormData({...formData, surname: e.target.value})} 
                required 
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={formData.email} 
              disabled 
              className="disabled-input"
            />
          </div>

          <div className="row">
            <div className="input-group">
              <label>Телефон</label>
              <input 
                placeholder="+380..." 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label>Дата народження</label>
              <input 
                type="date" 
                value={formData.birthDate} 
                onChange={e => setFormData({...formData, birthDate: e.target.value})} 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Адреса</label>
            <input 
              placeholder="Місто, вулиця, будинок" 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
            />
          </div>

          <div className="form-actions">
            {user && onDelete && (
              <button type="button" className="delete-btn" onClick={() => onDelete(user._id)}>
                Видалити
              </button>
            )}
            <button type="submit" className="main-btn">Зберегти зміни</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;