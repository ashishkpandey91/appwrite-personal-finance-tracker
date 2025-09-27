import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Index from "./pages/Index";
import AuthLayout from "./components/AuthLayout";
import TestEnv from "./pages/TestEnv";
import "./index.css";
import { Toaster } from "@/components/ui/sonner"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authentication>
            <Index />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignupPage />
          </AuthLayout>
        ),
      },
      {
        path: "/test-env",
        element: <TestEnv />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster  position="top-center" />
    </Provider>
  </StrictMode>
);
