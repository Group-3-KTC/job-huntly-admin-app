import { Navigate } from "react-router-dom";
import type { RootState } from "../app/store.ts";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, authInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!authInitialized) return null;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
