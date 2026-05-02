import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/products', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    pagination: null,
    loading: false,
    error: null,
    currentProduct: null,
  },
  reducers: {
    setCurrentProduct: (state, action) => { state.currentProduct = action.payload; },
    clearProducts: (state) => { state.items = []; state.pagination = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentProduct, clearProducts } = productSlice.actions;
export default productSlice.reducer;
