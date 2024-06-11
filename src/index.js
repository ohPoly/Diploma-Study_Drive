import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";

// Create a root.
const container = document.getElementById("root");
const root = createRoot(container);

// Initial render: Render an element to the root.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
