import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

// 1. Інтерфейс згідно з твоєю схемою Mongoose
export interface Library {
  _id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  image?: string;
  workingHours: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LibraryState {
  items: Library[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LibraryState = {
  items: [],
  status: 'idle',
  error: null,
};

// 2. Async Thunks

// Отримати всі бібліотеки
export const fetchAllLibraries = createAsyncThunk(
  'libraries/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/libraries');
      // Очікуємо масив об'єктів ILibrary
      return response.data as Library[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Не вдалося завантажити філії бібліотек'
      );
    }
  }
);

// Створити нову філію
export const createLibrary = createAsyncThunk(
  'libraries/create',
  async (libraryData: Partial<Library>, thunkAPI) => {
    try {
      const response = await api.post('/libraries', libraryData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Помилка при створенні філії'
      );
    }
  }
);

// Оновити дані філії
export const updateLibrary = createAsyncThunk(
  'libraries/update',
  async ({ id, ...updateData }: { id: string } & Partial<Library>, thunkAPI) => {
    try {
      const response = await api.put(`/libraries/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Помилка при оновленні філії'
      );
    }
  }
);

// Видалити філію
export const deleteLibrary = createAsyncThunk(
  'libraries/delete',
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`/libraries/${id}`);
      return id; // Повертаємо ID для видалення зі стору
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Помилка при видаленні філії'
      );
    }
  }
);

// 3. Slice
const librarySlice = createSlice({
  name: 'libraries',
  initialState,
  reducers: {
    // Можна додати синхронний екшен для скидання помилок
    clearLibraryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Libraries
      .addCase(fetchAllLibraries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllLibraries.fulfilled, (state, action: PayloadAction<Library[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllLibraries.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Create Library
      .addCase(createLibrary.fulfilled, (state, action: PayloadAction<Library>) => {
        state.items.unshift(action.payload); // Додаємо нову бібліотеку на початок списку
      })

      // Update Library
      .addCase(updateLibrary.fulfilled, (state, action: PayloadAction<Library>) => {
        const index = state.items.findIndex((lib) => lib._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete Library
      .addCase(deleteLibrary.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((lib) => lib._id !== action.payload);
      });
  },
});

export const { clearLibraryError } = librarySlice.actions;
export default librarySlice.reducer;