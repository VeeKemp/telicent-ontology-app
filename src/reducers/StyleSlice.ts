import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DefaultStyle } from "../services/ApiManager";
import { RootState } from "../store";

export interface StylesState {
  styles: Record<string, DefaultStyle> | null;
}

export const initialState: StylesState = {
  styles: null,
};

export const styleSlice = createSlice({
  name: "style",
  initialState,
  reducers: {
    addStyles: (state, action: PayloadAction<Record<string, DefaultStyle>>) => {
      state.styles = action.payload;
    },
  },
});

export const { addStyles } = styleSlice.actions;

export const selectStyles = (state: RootState) => state.style.styles;

export default styleSlice.reducer;
