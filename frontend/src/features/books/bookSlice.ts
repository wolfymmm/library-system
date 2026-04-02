import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// 1. Описуємо інтерфейси (типи даних)
interface Author {
  _id: string;
  name: string;
  bio?: string;
}

export interface Book {
  _id: string;
  title: string;
  author: Author | string; // Може бути об'єктом (після populate) або просто ID
  image: string;
  description?: string;
}

interface BookState {
  items: Book[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Початковий стан із явним типом
const initialState: BookState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const response = await fetch(`${API_URL}/api/books`);
  if (!response.ok) throw new Error('Помилка завантаження');
  return (await response.json()) as Book[]; // Кажемо TS, що прийдуть саме книги
});

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Щось пішло не так';
      });
  },
});

export default bookSlice.reducer;