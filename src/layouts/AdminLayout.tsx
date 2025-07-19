import type { RootState } from "../app/store";
import { PageTracker } from "../components/common/PageTracker";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import AdminRoutes from "../routes/adminRoutes";
import "../styles/global.css";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.ui.isSidebarCollapsed,
  );

  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 z-20 h-full shadow-lg md:shadow-none transition-transform duration-300 ease-in-out">
        <Sidebar />
      </div>

      <main
        className={` scroll-x-only flex-1 min-h-screen bg-gray-200 transition-all duration-300 ease-in-out
                     ${
                       isSidebarCollapsed
                         ? "ml-[5.5rem] md:ml-[5.5rem]"
                         : "ml-0 md:ml-[16rem]"
                     }
                  `}
      >
        <PageTracker />
        <Header />
        <div>
          <AdminRoutes />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
