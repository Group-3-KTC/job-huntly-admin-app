import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage.tsx";
import { useAuthInitializer } from "./features/auth/hooks/useAuthInitializer.ts";
import { initI18n } from "./i18n/i18n.ts";

function App() {
  useAuthInitializer();
  initI18n();
  // useEffect(() => {
  //   initI18n();
  // }, []);
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
