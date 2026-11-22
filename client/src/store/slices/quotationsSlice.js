//===========================================================================================
//    REDUX QUOTATIONS SLICE (ASYNC THUNK PATTERN)
//    Standardized Redux Toolkit API data fetching and state caching for Quotations module
// ===========================================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchQuotations,
  approveQuotation,
  rejectQuotation,
  sendQuotation,
} from '../../services/quotationsService';

//===========================================================================================
//    ASYNC THUNKS (API CALLING ACTIONS)
// ===========================================================================================

/**
 * Fetch paginated, server-filtered quotations
 */
export const fetchQuotationsThunk = createAsyncThunk(
  'quotations/fetchQuotations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchQuotations(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch quotations.');
    }
  }
);

/**
 * Approve a pending quotation with an optional manager note
 */
export const approveQuotationThunk = createAsyncThunk(
  'quotations/approveQuotation',
  async ({ id, note }, { rejectWithValue }) => {
    try {
      const response = await approveQuotation(id, { note });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to approve quotation.');
    }
  }
);

/**
 * Reject a pending quotation with a mandatory manager reason
 */
export const rejectQuotationThunk = createAsyncThunk(
  'quotations/rejectQuotation',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await rejectQuotation(id, { reason });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject quotation.');
    }
  }
);

/**
 * Send an approved quotation to customer
 */
export const sendQuotationThunk = createAsyncThunk(
  'quotations/sendQuotation',
  async (id, { rejectWithValue }) => {
    try {
      const response = await sendQuotation(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send quotation.');
    }
  }
);

//===========================================================================================
//    INITIAL STATE & SLICE DEFINITION
// ===========================================================================================

const initialState = {
  items: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  stats: {},
  productOptions: [],
  loading: false,
  actionLoading: false,
  error: null,
};

export const quotationsSlice = createSlice({
  name: 'quotations',
  initialState,
  reducers: {
    clearQuotationError: (state) => {
      state.error = null;
    },
    resetQuotationsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch Quotations ────────────────────────────────────────────────────────
      .addCase(fetchQuotationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.rows || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.stats = action.payload.stats || {};
        state.productOptions = action.payload.productOptions || [];
      })
      .addCase(fetchQuotationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load quotations.';
      })

      // ── Approve Quotation ───────────────────────────────────────────────────────
      .addCase(approveQuotationThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(approveQuotationThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.items = state.items.map((q) => (q.id === updated.id ? { ...q, ...updated } : q));
      })
      .addCase(approveQuotationThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ── Reject Quotation ────────────────────────────────────────────────────────
      .addCase(rejectQuotationThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(rejectQuotationThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.items = state.items.map((q) => (q.id === updated.id ? { ...q, ...updated } : q));
      })
      .addCase(rejectQuotationThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ── Send Quotation ──────────────────────────────────────────────────────────
      .addCase(sendQuotationThunk.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(sendQuotationThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.items = state.items.map((q) => (q.id === updated.id ? { ...q, ...updated } : q));
      })
      .addCase(sendQuotationThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuotationError, resetQuotationsState } = quotationsSlice.actions;
export default quotationsSlice.reducer;
