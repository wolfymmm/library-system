import React, { useState } from 'react';
import './OrderStatusModal.scss';

interface OrderStatusProps {
  order: any;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

const OrderStatusModal: React.FC<OrderStatusProps> = ({ order, onClose, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status || 'pending');

  // Статуси оновлено згідно з твоєю моделлю IOrder
  const statuses = [
    { value: 'pending', label: 'Очікує підтвердження', color: '#FFA500' },
    { value: 'confirmed', label: 'Підтверджено', color: '#2196F3' },
    { value: 'shipped', label: 'Відправлено', color: '#9C27B0' },
    { value: 'delivered', label: 'Доставлено / На руках', color: '#4CAF50' },
    { value: 'returned', label: 'Повернуто', color: '#888888' },
  ];

  const handleSave = () => {
    onUpdateStatus(order._id, selectedStatus);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content form-modal status-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="order-summary">
          <h2>Оновити статус замовлення</h2>
          <div className="mini-info">
            <img 
              src={order.bookId?.image || "/book-cover-placeholder.png"} 
              alt={order.bookId?.title} 
            />
            <div>
              <strong>{order.bookId?.title || 'Назва відсутня'}</strong>
              <p>{order.userId?.name} {order.userId?.surname}</p>
            </div>
          </div>
        </div>

        <div className="status-options">
          {statuses.map((status) => (
            <label 
              key={status.value} 
              className={`status-label ${selectedStatus === status.value ? 'selected' : ''}`}
            >
              <input 
                type="radio" 
                name="status" 
                value={status.value} 
                checked={selectedStatus === status.value}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
              <span className="dot" style={{ backgroundColor: status.color }}></span>
              <span className="label-text">{status.label}</span>
            </label>
          ))}
        </div>

        <div className="form-actions">
          <button className="main-btn" onClick={handleSave}>
            Підтвердити статус
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;