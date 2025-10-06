import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "aos/dist/aos.css";
import AOS from "aos";
AOS.init();
import { RouterProvider } from "react-router";
import router from "./router/router.jsx";
import AuthProvider from "./contexts/AuthContext/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <div className="font-urbanist max-w-7xl mx-auto">
        <RouterProvider router={router}></RouterProvider>
      </div>
    </AuthProvider>
  </StrictMode>
);
