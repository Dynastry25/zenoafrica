import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeModal: null, // 'login' | 'register' | 'booking' | 'visa' | 'contact' | null
    mobileMenuOpen: false,
    searchOpen: false,
  },
  reducers: {
    openModal: (state, action) => {
      state.activeModal = action.payload;
      state.mobileMenuOpen = false;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
  },
});

export const { openModal, closeModal, toggleMobileMenu, closeMobileMenu, toggleSearch } = uiSlice.actions;
export default uiSlice.reducer;
