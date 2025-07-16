import { Bell } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store.ts";

const Header = () => {
  const pageTitle = useSelector((state: RootState) => state.page.title);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm rounded-xl m-6">
        <h1 className="text-xl font-bold">{pageTitle}</h1>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          {/* Notification */}
          <div className="relative cursor-pointer">
            <Bell size={22} className="text-blue-500" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              9
            </span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="text-right text-sm">
              <p className="font-medium">Moni Roy</p>
              <p className="text-gray-400 text-xs">Admin</p>
            </div>
            <img
              src="https://i.pravatar.cc/40?img=5"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
