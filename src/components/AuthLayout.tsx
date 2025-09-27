import { useAppSelector } from "@/store/hook";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
  authentication: boolean;
}

export default function AuthLayout({ children, authentication }: Props) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (authentication && !isAuthenticated) return <Navigate to="/login" />;
  if (!authentication && isAuthenticated) return <Navigate to="/" />;

  return <>{children}</>;
}
