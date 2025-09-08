import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  CaretDown,
  CaretUp,
  SignOut,
  TrendUp,
  ChartBar,
  User
} from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/store/authSlice.ts";
import { useState } from "react";

const UserMenu = () => {
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Đợi chút để hiển thị loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Gọi action logout sẽ tự redirect đến API logout 
      dispatch(logout());
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      setIsLoggingOut(false);
    }
  };
  
  if (isLoggingOut) {
    return (
      <>
        <div className="fixed inset-0 z-[10] bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="rounded-lg min-w-full shadow-sm border border-gray-200 p-30 text-center">
              <div className="mx-auto loader border-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">Đang đăng xuất...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton className="flex items-center gap-2 focus:outline-none cursor-pointer">
            {/* Caret icon switch */}
            {open ? (
              <CaretUp size={16} className="text-gray-500" />
            ) : (
              <CaretDown size={16} className="text-gray-500" />
            )}
          </PopoverButton>

          <PopoverPanel
            anchor="bottom end"
            className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 divide-y divide-gray-200 z-50"
          >
            <div className="p-3 space-y-2">
              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100 transition"
              >
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <User size={16} /> Hồ sơ cá nhân
                </div>
                <p className="text-sm text-gray-500">
                  Xem và cập nhật thông tin tài khoản
                </p>
              </a>

              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100 transition"
              >
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendUp size={16} /> Thống kê
                </div>
                <p className="text-sm text-gray-500">
                  Xem báo cáo hoạt động trong tháng
                </p>
              </a>

              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100 transition"
              >
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <ChartBar size={16} /> Báo cáo
                </div>
                <p className="text-sm text-gray-500">
                  Báo cáo dữ liệu người dùng
                </p>
              </a>
            </div>

            <div className="p-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-gray-100 transition rounded-lg"
              >
                <SignOut size={18} />
                Đăng xuất
              </button>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};

export default UserMenu;
