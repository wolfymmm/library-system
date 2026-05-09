import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// --- Типізація для замовлень ---
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
    libraryName?: string; // Додано для консистентності з модалкою
    postDetails?: {
      service: 'Nova Poshta';
      region: string;
      city: string;
      officeNumber: string;
    };
  };
  duration: number;
}

// --- Thunks ---

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

// 3. Оновлення статусу замовлення
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }: { orderId: string; status: string }, { rejectWithValue }) => {
    try {
      // Відправляємо запит на /orders/ID
      const response = await api.put(`/orders/${orderId}`, { status }); 
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Помилка оновлення');
    }
  }
);

// --- State ---

interface OrderState {
  allOrders: IOrder[];
  isLoading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: OrderState = {
  allOrders: [],
  isLoading: false,
  success: false,
  error: null,
};

// --- Slice ---

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
      .addCase(createOrder.pending, (state) => { 
        state.isLoading = true; 
        state.error = null;
      })
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
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Оновлення статусу замовлення
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Знаходимо замовлення в масиві та оновлюємо його динамічно
        const index = state.allOrders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.allOrders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;