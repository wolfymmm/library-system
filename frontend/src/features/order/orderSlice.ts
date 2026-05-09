import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// --- Типізація для замовлень (додай сюди поля з бази даних) ---
export interface IOrder {
  _id: string;
  userId: { _id: string; name: string; surname: string; phone: string };
  bookId: { _id: string; title: string; image: string };
  delivery: {
    method: 'post' | 'library_pickup';
    libraryName?: string;
  };
  status: string;
  orderDate: string;
  returnDate: string;
}

export interface OrderData {
  bookId: string;
  delivery: {
    method: 'post' | 'library_pickup';
    postDetails?: {
      service: 'Nova Poshta';
      region: string;
      city: string;
      officeNumber: string;
    };
  };
  duration: number;
}

// 1. Створення замовлення
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: OrderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Помилка замовлення');
    }
  }
);

// 2. Отримання всіх замовлень (для адміна)
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Помилка завантаження замовлень');
    }
  }
);

interface OrderState {
  allOrders: IOrder[]; // Обов'язково додай це в initialState
  isLoading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: OrderState = {
  allOrders: [], // Початкове значення - порожній масив
  isLoading: false,
  success: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrder: (state) => { 
      state.success = false; 
      state.error = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      // Створення замовлення
      .addCase(createOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createOrder.fulfilled, (state) => { 
        state.isLoading = false; 
        state.success = true; 
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Завантаження всіх замовлень
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allOrders = action.payload; // Тепер TS бачить це поле
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;