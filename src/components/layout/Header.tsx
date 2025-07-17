import { useSelector } from "react-redux";
import type { RootState } from "../../app/store.ts";
import UserMenu from "../common/UserMenu.tsx";
import NotificationMenu from "../common/NotificationMenu.tsx";

const Header = () => {
  const pageTitle = useSelector((state: RootState) => state.page.title);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm rounded-xl m-6">
        <h1 className="text-xl font-bold">{pageTitle}</h1>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          {/* Notification */}
          <NotificationMenu />

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

          <UserMenu />
        </div>
      </div>
    </>
  );
};

export default Header;
