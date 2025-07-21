import { Navigate } from "react-router-dom";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";
import AppErrorBoundary from "./AppErrorBoundary"; // <-- ErrorBoundary

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, authInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!authInitialized) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppErrorBoundary>{children}</AppErrorBoundary>;
};
