import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store.ts";
import UserMenu from "../common/UserMenu.tsx";
import NotificationMenu from "../common/NotificationMenu.tsx";
import { LanguageSelector } from "../common/LanguageSelector.tsx";
import { List } from "@phosphor-icons/react";
import { toggleSidebarOpen } from "../../store/uiSlice";

const Header = () => {
  const dispatch = useDispatch();
  const pageTitle = useSelector((state: RootState) => state.page.title);
  const isSidebarOpen = useSelector(
    (state: RootState) => state.ui.isSidebarOpen,
  );

  return (
    <div className="flex items-center justify-between px-4 py-4 m-6 bg-white shadow-sm rounded-xl">
      <div className="flex items-center gap-4">
        <button
          className="text-gray-500 md:hidden hover:text-blue-600"
          onClick={() => dispatch(toggleSidebarOpen(!isSidebarOpen))} 
          aria-label="Toggle Sidebar"
        >
          <List size={24} />
        </button>
        <h1 className="text-xl font-bold text-blue-600">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-5">
        <LanguageSelector />
        <NotificationMenu />
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-sm text-right">
            <p className="font-medium">Moni Roy</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <img
            src="https://i.pravatar.cc/40?img=3"
            alt="User"
            className="object-cover w-8 h-8 rounded-full"
          />
        </div>
        <UserMenu />
      </div>
    </div>
  );
};

export default Header;