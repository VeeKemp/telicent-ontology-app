import { combineReducers, configureStore } from "@reduxjs/toolkit";

import styleReducer from "./reducers/StyleSlice";
import selectedNodesReducer from "./reducers/SelectedNodesSlice";
import alertReducer from "./reducers/AlertSlice";
import namespacesReducer from "./reducers/NamespaceSlice";
import instanceViewReducer from "./reducers/InstanceViewSlice";

const rootReducer = combineReducers({
  style: styleReducer,
  selectedNodes: selectedNodesReducer,
  alerts: alertReducer,
  namespaces: namespacesReducer,
  instanceView: instanceViewReducer,
});

const setupStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

const store = setupStore();

export { store, setupStore };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
