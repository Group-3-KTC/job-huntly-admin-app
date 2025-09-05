import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage.tsx";
import { useAuthInitializer } from "./features/auth/hooks/useAuthInitializer.ts";
import Error404 from "./pages/error/Error404.tsx";
import AdminRoutes from "./routes/adminRoutes.tsx";
import { Toaster } from 'react-hot-toast';

function App() {
  useAuthInitializer();

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
          },
          success: {
            icon: '✅',
            style: {
              border: '1px solid #10B981',
            }
          },
          error: {
            icon: '❌',
            style: {
              border: '1px solid #EF4444',
            }
          }
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected admin layout & routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/*Route con nằm trong children */}
          {AdminRoutes}
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
