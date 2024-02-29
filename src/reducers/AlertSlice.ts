import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AlertColor } from "@mui/material";

export interface OntologyAlert {
  severity: AlertColor;
  message: string;
}

export interface ErrorState {
  messages: OntologyAlert[];
}

export const initialState: ErrorState = {
  messages: [],
};

export const AlertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    dismissMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (error) => error.message !== action.payload
      );
    },
    addError: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.concat({
        severity: "error",
        message: action.payload,
      });
    },
    addSuccess: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.concat({
        severity: "success",
        message: action.payload,
      });
    },
    resetMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { dismissMessage, addError, resetMessages, addSuccess } =
  AlertSlice.actions;

export const selectAlerts = (state: RootState) => state.alerts.messages;

export default AlertSlice.reducer;
