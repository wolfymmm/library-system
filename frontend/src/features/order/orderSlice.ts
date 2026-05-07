import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

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

const orderSlice = createSlice({
  name: 'orders',
  initialState: { isLoading: false, success: false, error: null as string | null },
  reducers: {
    resetOrder: (state) => { state.success = false; state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createOrder.fulfilled, (state) => { state.isLoading = false; state.success = true; })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;