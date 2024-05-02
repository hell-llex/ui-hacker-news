import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { News } from '../../types';

const initialState: {
  items: News[];
} = {
  items: [],
};

const hackerNewsSlice = createSlice({
  name: 'hackerNews',
  initialState,
  reducers: {
    changeItems(state, action: PayloadAction<News[]>) {
      state.items = action.payload
    },
  },
});

export const hackerNewsReducer = hackerNewsSlice.reducer;
export const { changeItems } = hackerNewsSlice.actions;
