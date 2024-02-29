import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface StylesState {
  nodeIds: string[];
}

export const initialState: StylesState = {
  nodeIds: [],
};

export const selectedNodesSlice = createSlice({
  name: "selectedNodes",
  initialState,
  reducers: {
    addSelectedNodes: (state, action: PayloadAction<string[]>) => {
      state.nodeIds = action.payload;
    },
    addSelectedNode: (state, action: PayloadAction<string>) => {
      state.nodeIds = [action.payload];
    },
  },
});

export const { addSelectedNodes, addSelectedNode } = selectedNodesSlice.actions;

export const selectSelectedNodeIds = (state: RootState) =>
  state.selectedNodes.nodeIds;

export default selectedNodesSlice.reducer;
