import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './BookCRUDModal.scss';
import axios from '../../api/axios';

interface BookFormProps {
  book?: any;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
}

const BookCRUDModal: React.FC<BookFormProps> = ({ book, onClose, onSave, onDelete }) => {
  const { items: allLibraries = [] } = useSelector((state: any) => state.libraries);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Детективи',
    description: '',
    image: '',
    pages: '',
    releaseYear: '',
    stock: {} as { [key: string]: number }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: typeof book.author === 'object' ? (book.author.name || '') : (book.author || ''),
        isbn: book.isbn || '',
        category: book.category || 'Детективи',
        description: book.description || '',
        image: book.image || '',
        pages: book.pages || '',
        releaseYear: book.releaseYear || '',
        stock: book.stock ? (book.stock instanceof Map ? Object.fromEntries(book.stock) : book.stock) : {}
      });
    }
  }, [book]);

  const handleAIAnalysis = async () => {
  if (!formData.title || formData.description.length < 10) {
    alert("Будь ласка, введіть назву та опис (мінімум 10 символів) для аналізу.");
    return;
  }

  setIsAnalyzing(true);
  setShowAIModal(true);

  try {
    // ТЕПЕР запит йде на Твій Node.js бекенд, а не прямо на Python
    // Шлях буде виглядати як: твій_api/books/analyze-ai
    const response = await axios.post('/books/analyze-ai', {
      title: formData.title,
      description: formData.description
    });
    
    // Переконайся, що структура відповіді з Node.js така ж сама
    setAiSuggestions(response.data.suggested_genres);
  } catch (error: any) {
    console.error("AI Proxy Error:", error);
    // Виводимо повідомлення, яке прийшло від твого Node.js сервера
    const errorMessage = error.response?.data?.message || "Не вдалося проаналізувати книгу через бекенд";
    alert(errorMessage);
    setShowAIModal(false);
  } finally {
    setIsAnalyzing(false);
  }
};

  const handleStockChange = (libName: string, count: string) => {
    setFormData(prev => ({
      ...prev,
      stock: {
        ...prev.stock,
        [libName]: Number(count)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn.trim(),
      pages: formData.pages ? Number(formData.pages) : undefined,
      releaseYear: formData.releaseYear ? Number(formData.releaseYear) : undefined,
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
            <div className="title-ai-wrapper">
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Наприклад: Хімія смерті"
              />
              <button
                type="button"
                onClick={handleAIAnalysis}
                disabled={!formData.title || !formData.description}
                className={`ai-btn ${formData.title && formData.description ? 'active' : ''}`}
              >
                ✨ Аналізувати
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Автор (Ім'я та Прізвище)</label>
            <input
              type="text"
              value={formData.author}
              onChange={e => setFormData({ ...formData, author: e.target.value })}
              required
              placeholder="Саймон Бекетт"
            />
          </div>

          <div className="stock-section">
            <h3 className="stock-title">Наявність у філіях</h3>
            <div className="stock-grid">
              {allLibraries.length > 0 ? (
                allLibraries.map((lib: any) => (
                  <div key={lib._id} className="stock-control">
                    <div className="lib-info">
                      <span className="lib-name">{lib.name}</span>
                      <span className="lib-address">{lib.address}</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock[lib.name] || 0}
                      onChange={e => handleStockChange(lib.name, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <p className="no-libs">Бібліотеки не знайдені у системі.</p>
              )}
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-..."
              />
            </div>
            <div className="input-group">
              <label>Категорія</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option>Детективи</option>
                <option>Фантастика</option>
                <option>Фентезі</option>
                <option>Класика</option>
                <option>Романтична проза</option>
                <option>Сучасна проза</option>
                <option>Трилери та жахи</option>
                <option>Комікси та манги</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Рік видання</label>
              <input
                type="number"
                value={formData.releaseYear}
                onChange={e => setFormData({ ...formData, releaseYear: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Сторінок</label>
              <input
                type="number"
                value={formData.pages}
                onChange={e => setFormData({ ...formData, pages: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label>URL обкладинки</label>
            <input
              type="text"
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="input-group">
            <label>Опис книги</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
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

        {/* AI Modal - тепер винесено за форму, але всередині контенту */}
        {showAIModal && (
          <div className="ai-modal-overlay">
            <div className="ai-results-card">
              {isAnalyzing ? (
                <div className="loader">
                  <span className="brain-icon">🧠</span>
                  <p>ШІ аналізує текст... зачекайте</p>
                </div>
              ) : (
                <>
                  <h3>Запропоновані категорії:</h3>
                  <p className="ai-subtext">На основі назви та опису книги</p>
                  <div className="suggestions-list">
                    {aiSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`suggestion-btn ${idx === 0 ? 'top-match' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, category: s.label });
                          setShowAIModal(false);
                        }}
                      >
                        <strong>{s.label}</strong> — {s.confidence}%
                      </button>
                    ))}
                  </div>
                  <button type="button" className="cancel-ai" onClick={() => setShowAIModal(false)}>
                    Скасувати
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCRUDModal;