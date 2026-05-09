import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios'; // Використовуємо ваш налаштований axios клієнт

// --- Інтерфейси залишаються без змін ---
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

const initialState: BookState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- Async Thunks ---

// Отримання всіх книг
export const fetchBooks = createAsyncThunk('books/fetchBooks', async (_, thunkAPI) => {
  try {
    const response = await api.get('/books');
    return response.data as Book[];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Помилка завантаження');
  }
});

// Створення нової книги
export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData: Partial<Book>, thunkAPI) => {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Помилка при створенні');
    }
  }
);

// Оновлення книги
export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, ...updateData }: { id: string } & Partial<Book>, thunkAPI) => {
    try {
      const response = await api.put(`/books/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Помилка при оновленні');
    }
  }
);

// Видалення книги
export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`/books/${id}`);
      return id; // Повертаємо ID, щоб видалити його зі стору
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Помилка при видаленні');
    }
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Create Book
      .addCase(createBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.items.push(action.payload); // Додаємо нову книгу в кінець списку
      })

      // Update Book
      .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
        const index = state.items.findIndex((book) => book._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload; // Замінюємо стару версію книги на нову
        }
      })

      // Delete Book
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((book) => book._id !== action.payload);
      });
  },
});

export default bookSlice.reducer;