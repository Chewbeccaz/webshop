import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import { NotFound } from "./components/NotFound";
import { Admin } from "./components/Admin";
import { Confirmation } from "./components/Confirmation";

export const Router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,

    children: [
      {
        path: "/",
        element: <App />,
        index: true,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/confirmation",
        element: <Confirmation />,
      },
    ],
  },
]);
