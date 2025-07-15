// src/context/AuthContext.tsx
import React, { createContext, useState, type ReactNode,  } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("admin_token")
  ); // Kiểm tra token khi khởi tạo

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
