import { createSlice } from '@reduxjs/toolkit';

export interface NavState {
  isMobileMenuOpen: boolean;
}

const initialState: NavState = {
  isMobileMenuOpen: false,
};

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
  },
});

export const { toggleMobileMenu, closeMobileMenu } = navSlice.actions;

export const selectIsMobileMenuOpen = (state: { nav: NavState }) => state.nav.isMobileMenuOpen;

export default navSlice.reducer;
