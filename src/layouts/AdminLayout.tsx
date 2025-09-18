import { Outlet } from "react-router-dom";
import type { RootState } from "../app/store";
import { PageTracker } from "../components/common/PageTracker";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react"; 
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
  const sidebarRef = useRef<HTMLDivElement>(null); 


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


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (isSidebarOpen && window.innerWidth < 768) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target as Node)
        ) {
          dispatch(toggleSidebarOpen(false));
        }
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, dispatch]);

  return (
    <div key={lang} className="flex h-screen overflow-hidden scroll-x-only">
      <div
        ref={sidebarRef} 
        className="fixed top-0 left-0 md:z-[9] z-[10] h-full shadow-lg transition-transform duration-300 ease-in-out"
      >
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
        <div className="sticky top-0 z-[9] md:z-[10] bg-gray-200">
          <Header />
        </div>
        <div className="min-w-vh relative z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 