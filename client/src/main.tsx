import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import CartProvider from "./context/CartContext.tsx";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CartProvider>
      {/* <App /> */}
      <RouterProvider router={Router}></RouterProvider>
    </CartProvider>
  </React.StrictMode>
);
