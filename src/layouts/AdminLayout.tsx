import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import AdminRoutes from "../routes/adminRoutes";
import "../styles/global.css"

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-200">
        <Header />
        <div className="p-4">
          <AdminRoutes />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
