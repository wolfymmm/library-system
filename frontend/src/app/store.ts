import { configureStore } from '@reduxjs/toolkit';
import bookReducer from '../features/books/bookSlice';
import authReducer from '../features/auth/authSlice';
import orderReducer from '../features/order/orderSlice';
import libraryReducer from '../features/libraries/librariesSlice';

export const store = configureStore({
  reducer: {
    books: bookReducer,
    auth: authReducer,
    orders: orderReducer,
    libraries: libraryReducer,
  },
});

// Експортуємо типи
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;