import { Outlet } from "react-router-dom";
import type { RootState } from "../app/store";
import { PageTracker } from "../components/common/PageTracker";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "../styles/global.css";
import { useCurrentLanguage } from "../hooks/useCurrentLanguage";
import { toggleSidebarOpen } from "../store/uiSlice";

const AdminLayout = () => {
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.ui.isSidebarCollapsed,
  );
  const isSidebarOpen = useSelector(
    (state: RootState) => state.ui.isSidebarOpen,
  );
  const dispatch = useDispatch();
  const lang = useCurrentLanguage();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        dispatch(toggleSidebarOpen(false));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen, dispatch]);

  return (
    <div key={lang} className="flex h-screen overflow-hidden scroll-x-only">
      <div className="fixed top-0 left-0 z-20 h-full shadow-lg transition-transform duration-300 ease-in-out">
        <Sidebar />
      </div>
      <main
        className={`flex-1 h-full overflow-y-auto bg-gray-200 transition-all duration-300 ease-in-out
                    ${
                      isSidebarOpen
                        ? "ml-0 md:ml-[16rem]"
                        : isSidebarCollapsed
                        ? "ml-0 md:ml-[5.5rem]"
                        : "ml-0 md:ml-[16rem]"
                    }`}
      >
        <PageTracker />
        <div className="sticky top-0 z-10 bg-gray-200">
          <Header />
        </div>
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
