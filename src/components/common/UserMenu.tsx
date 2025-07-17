import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  CaretDown,
  CaretUp,
  SignOut,
  Lightning,
  TrendUp,
  ChartBar,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/store/authSlice.ts";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton className="flex items-center gap-2 focus:outline-none">

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
                  <TrendUp size={16} /> Insights
                </div>
                <p className="text-sm text-gray-500">
                  Measure actions your users take
                </p>
              </a>

              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100 transition"
              >
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <Lightning size={16} /> Automations
                </div>
                <p className="text-sm text-gray-500">
                  Create your own targeted content
                </p>
              </a>

              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100 transition"
              >
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <ChartBar size={16} /> Reports
                </div>
                <p className="text-sm text-gray-500">
                  Keep track of your growth
                </p>
              </a>
            </div>

            <div className="p-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-gray-100 transition rounded-lg"
              >
                <SignOut size={18} />
                Logout
              </button>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};

export default UserMenu;
