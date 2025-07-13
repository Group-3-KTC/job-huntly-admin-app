import Sidebar from "../components/layout/Sidebar";
import AdminRoutes from "../routes/AdminRoutes";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 py-16 bg-gray-200 md:p-4">
        <AdminRoutes />
      </main>
    </div>
  );
};

export default AdminLayout;
