import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage.tsx";
import { useAuthInitializer } from "./features/auth/hooks/useAuthInitializer.ts";

function App() {
  useAuthInitializer();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
