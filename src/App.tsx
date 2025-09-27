import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import authService from "@/services/auth.appwrite";
import { login, logout } from "@/features/authSlice";
import { useAppDispatch } from "@/store/hook";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { NetworkStatus } from "@/components/NetworkStatus";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    authService.getCurrentUser().then(({ data }) => {
      if (data) dispatch(login(data));
      else dispatch(logout());
      setLoading(false);
    });
  }, []);

  return !loading ? (
    <>
      <NetworkStatus />
      <main className=" flex flex-col items-center justify-center align-middle w-full min-h-screen">
        <Outlet />
        <PWAInstallPrompt />
      </main>
    </>
  ) : null;
}

export default App;
