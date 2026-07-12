import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingAPI } from '../../api/axios';

// ─── Async Thunks ────────────────────────────────────────────
export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
  try {
    const res = await bookingAPI.create(data);
    return res.data.booking;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Booking failed');
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMy', async (params, { rejectWithValue }) => {
  try {
    const res = await bookingAPI.getMy(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load bookings');
  }
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const res = await bookingAPI.cancel(id, reason);
    return res.data.booking;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Cancellation failed');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    items: [],
    total: 0,
    current: null,
    cartPackage: null, // Package being booked (selected in modal)
    bookingDraft: null, // Draft booking data before payment
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    setCartPackage: (state, action) => {
      state.cartPackage = action.payload;
    },
    clearCartPackage: (state) => {
      state.cartPackage = null;
      state.bookingDraft = null;
    },
    setBookingDraft: (state, action) => {
      state.bookingDraft = action.payload;
    },
    clearBookingSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.items.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.bookings;
        state.total = action.payload.total;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { setCartPackage, clearCartPackage, setBookingDraft, clearBookingSuccess } = bookingSlice.actions;
export default bookingSlice.reducer;
