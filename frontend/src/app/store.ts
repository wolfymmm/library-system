import { configureStore } from '@reduxjs/toolkit';
import bookReducer from '../features/books/bookSlice';
import authReducer from '../features/auth/authSlice';
import orderReducer from '../features/order/orderSlice';

export const store = configureStore({
  reducer: {
    books: bookReducer,
    auth: authReducer,
    orders: orderReducer,
  },
});

// Експортуємо типи
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;