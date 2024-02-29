import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import App from "./App";
import { store } from "./store";

import "reactflow/dist/style.css";
import "@telicent-oss/ds/dist/style.css";
import "@telicent-oss/ds/dist/fontawesome.css"
import "./main.css";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
