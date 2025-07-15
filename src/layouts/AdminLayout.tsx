import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import AdminRoutes from "../routes/adminRoutes";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen hide-scrollbar">
      <Sidebar />
      <main className="flex-1 px-4 py-16 bg-gray-200 md:p-4 hide-scrollbar">
        <Header/>
        <AdminRoutes />
      </main>
    </div>
  );
};

export default AdminLayout;
