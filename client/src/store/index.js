//==================================================================================================================
//    CENTRAL REDUX STORE
//    Root store configuration combining all slice reducers for G-CRM
//==================================================================================================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import quotationsReducer from './slices/quotationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quotations: quotationsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
