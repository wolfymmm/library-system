import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// 1. Описуємо інтерфейси
export interface Author {
  _id: string;
  name: string;
  bio?: string;
}

export interface Book {
  _id: string;
  title: string;
  author: Author | string; 
  isbn: string;
  pages?: number;
  writingYear?: number;
  releaseYear?: number;
  description?: string;
  category?: string; 
  image?: string;

  stock?: { [key: string]: number }; 
  createdAt?: string;
  updatedAt?: string;
}

export interface BookState {
  items: Book[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const initialState: BookState = {
  items: [],
  status: 'idle',
  error: null,
};

// 2. Async Thunk
export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const response = await fetch(`${API_URL}/api/books`);
  if (!response.ok) throw new Error('Помилка завантаження');
  const data = await response.json();
  return data as Book[];
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