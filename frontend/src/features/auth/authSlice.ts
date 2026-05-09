import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

// --- Типізація ---
export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  role: 'reader' | 'admin';
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  allUsers: User[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// --- Допоміжні функції для LocalStorage ---
const getSavedUser = (): User | null => {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === "undefined" || user === "null") return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

const getSavedToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

// --- Thunks ---

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/users/profile');
      const data = response.data.user || response.data;
      
      if (data.birthDate) {
        data.birthDate = new Date(data.birthDate).toISOString();
      }
      
      return data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        thunkAPI.dispatch(logout());
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Не вдалося завантажити профіль'
      );
    }
  }
);


// НОВИЙ: Отримати всіх користувачів (для Адміна)
export const fetchAllUsers = createAsyncThunk('auth/fetchAllUsers', async (_, thunkAPI) => {
  try {
    const response = await api.get('/users'); // Переконайся, що такий роут є на бекенді
    return response.data; // Очікуємо масив [User, User, ...]
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Помилка завантаження списку користувачів');
  }
});

// Виправлений Thunk для оновлення профілю в auth.slice.ts
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, thunkAPI) => {
    try {
      // 1. Валідація (залишаємо як є, це добре)
      const requiredFields: (keyof User)[] = ['name', 'surname', 'phone', 'address', 'birthDate'];
      for (const field of requiredFields) {
        if (!userData[field] || userData[field]?.toString().trim() === '') {
          return thunkAPI.rejectWithValue(`Поле ${field} є обов'язковим`);
        }
      }

      // 2. Відправляємо дані. 
      // ВАЖЛИВО: Передаємо дату як є, бекенд сам зробить new Date()
      const response = await api.put('/users/profile', userData);
      
      // Припускаємо, що бекенд повертає { success: true, user: { ... } } або просто { ...user }
      const data = response.data.user || response.data;

      // Нормалізуємо дату для Redux
      if (data.birthDate) {
        data.birthDate = new Date(data.birthDate).toISOString();
      }

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Помилка оновлення'
      );
    }
  }
);

// --- Початковий стан ---
const initialState: AuthState = {
  user: getSavedUser(),
  allUsers: [],
  token: getSavedToken(),
  isAuthenticated: !!getSavedToken(),
  isLoading: false,
  error: null,
};

// --- Слайс ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(getMe.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchAllUsers (Адмін)
      .addCase(fetchAllUsers.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        // Повна заміна об'єкта для гарантії актуальності полів
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserBirthDate = (state: { auth: AuthState }) => state.auth.user?.birthDate || null;
export const selectAllUsers = (state: { auth: AuthState }) => state.auth.allUsers; // Новий селектор
export const payload = (state: { auth: AuthState }) => state.auth.user?.birthDate || null;

export default authSlice.reducer;