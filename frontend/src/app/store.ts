import { configureStore } from '@reduxjs/toolkit';
import bookReducer from '../features/books/bookSlice';

export const store = configureStore({
  reducer: {
    books: bookReducer,
  },
});

// Експортуємо типи
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;