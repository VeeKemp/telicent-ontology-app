import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  namespaces: [
    {
      id: crypto.randomUUID(),
      prefix: "telicent",
      uri: "http://telicent.io/ontology/",
      active: false,
    },
    {
      id: crypto.randomUUID(),
      prefix: "ies",
      uri: "http://ies.data.gov.uk/ontology/ies4#",
      active: false,
    },
  ],
};

const NamespaceSlice = createSlice({
  name: "namespaces",
  initialState,
  reducers: {
    addNamespace: (
      state,
      action: PayloadAction<Pick<NamespaceObject, "prefix" | "uri">>
    ) => {
      return {
        ...state,
        namespaces: [
          { id: crypto.randomUUID(), active: false, ...action.payload },
          ...state.namespaces,
        ],
      };
    },
    updateNamespace: (state, action: PayloadAction<NamespaceObject>) => {
      const updatedNamespaces = state.namespaces.map((namespace) =>
        namespace.id === action.payload.id
          ? { ...namespace, ...action.payload }
          : namespace
      );

      return {
        ...state,
        namespaces: updatedNamespaces,
      };
    },
    deleteNamespace: (
      state,
      action: PayloadAction<Pick<NamespaceObject, "id">>
    ) => {
      const updatedNamespaces = state.namespaces.filter(
        (namespace) => namespace.id !== action.payload.id
      );

      return {
        ...state,
        namespaces: updatedNamespaces,
      };
    },
  },
});

export const selectNamespaces = (state: RootState) =>
  state.namespaces.namespaces;

export const { addNamespace, deleteNamespace, updateNamespace } =
  NamespaceSlice.actions;
export default NamespaceSlice.reducer;
