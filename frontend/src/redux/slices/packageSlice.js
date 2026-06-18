import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { packageAPI } from '../../api/axios';

const initialState = {
  items: [],
  featured: [],
  current: null,
  total: 0,
  totalPages: 1,
  currentPage: 1,
  filters: {
    category: 'all',
    sort: 'popular',
    minPrice: null,
    maxPrice: null,
    search: '',
  },
  loading: false,
  error: null,
};

// ─── Async Thunks ────────────────────────────────────────────
export const fetchPackages = createAsyncThunk('packages/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await packageAPI.getAll(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load packages');
  }
});

export const fetchFeaturedPackages = createAsyncThunk('packages/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const res = await packageAPI.getFeatured();
    return res.data.packages;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load featured packages');
  }
});

export const fetchPackageBySlug = createAsyncThunk('packages/fetchOne', async (slug, { rejectWithValue }) => {
  try {
    const res = await packageAPI.getOne(slug);
    return res.data.package;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Package not found');
  }
});

// ─── Slice ───────────────────────────────────────────────────
const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentPackage: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => { state.loading = true; })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.packages;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedPackages.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      .addCase(fetchPackageBySlug.pending, (state) => { state.loading = true; state.current = null; })
      .addCase(fetchPackageBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchPackageBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, clearCurrentPackage } = packageSlice.actions;
export default packageSlice.reducer;
