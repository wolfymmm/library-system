import React, { useState, useEffect } from 'react';
import './BookCRUDModal.scss'; // Використовуємо загальні стилі форм

interface BookFormProps {
  book?: any; 
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
}

const BookCRUDModal: React.FC<BookFormProps> = ({ book, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '', // Будемо передавати як рядок, а бекенд обробить
    isbn: '',
    category: 'Детективи',
    description: '',
    image: '',
    pages: '',
    releaseYear: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        // Перевіряємо, чи автор прийшов як об'єкт з полем name
        author: typeof book.author === 'object' ? (book.author.name || '') : (book.author || ''),
        isbn: book.isbn || '',
        category: book.category || 'Детективи',
        description: book.description || '',
        image: book.image || '',
        pages: book.pages || '',
        releaseYear: book.releaseYear || ''
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Формуємо об'єкт для відправки
    // Важливо: якщо бекенд очікує числа для сторінок/року, перетворюємо їх
    const dataToSave = {
      ...formData,
      pages: formData.pages ? Number(formData.pages) : undefined,
      releaseYear: formData.releaseYear ? Number(formData.releaseYear) : undefined
    };

    onSave(dataToSave);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content form-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{book ? 'Редагувати книгу' : 'Додати нову книгу'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Назва книги</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
              placeholder="Наприклад: Хімія смерті"
            />
          </div>

          <div className="input-group">
            <label>Автор (Ім'я та Прізвище)</label>
            <input 
              type="text" 
              value={formData.author} 
              onChange={e => setFormData({...formData, author: e.target.value})} 
              required 
              placeholder="Саймон Бекетт"
            />
          </div>

          <div className="row">
            <div className="input-group">
              <label>ISBN</label>
              <input 
                type="text" 
                value={formData.isbn} 
                onChange={e => setFormData({...formData, isbn: e.target.value})} 
                placeholder="978-..."
              />
            </div>
            <div className="input-group">
              <label>Категорія</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Детективи</option>
                <option>Фантастика</option>
                <option>Фентезі</option>
                <option>Класика</option>
                <option>Романтична проза</option>
                <option>Сучасна проза</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Рік видання</label>
              <input 
                type="number" 
                value={formData.releaseYear} 
                onChange={e => setFormData({...formData, releaseYear: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label>Сторінок</label>
              <input 
                type="number" 
                value={formData.pages} 
                onChange={e => setFormData({...formData, pages: e.target.value})} 
              />
            </div>
          </div>

          <div className="input-group">
            <label>URL обкладинки</label>
            <input 
              type="text" 
              value={formData.image} 
              onChange={e => setFormData({...formData, image: e.target.value})} 
              placeholder="https://..."
            />
          </div>

          <div className="input-group">
            <label>Опис книги</label>
            <textarea 
              rows={4} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Короткий зміст..."
            />
          </div>

          <div className="form-actions">
            {book && onDelete && (
              <button 
                type="button" 
                className="delete-btn" 
                onClick={() => onDelete(book._id)}
              >
                Видалити книгу
              </button>
            )}
            <button type="submit" className="main-btn">
              {book ? 'Зберегти зміни' : 'Створити книгу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookCRUDModal;