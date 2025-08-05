import { NavLink, useNavigate } from "react-router-dom";
import {
  ChartBar,
  List,
  Buildings,
  UsersFour,
  ReadCvLogo,
  SignOut,
  SidebarSimple, 
} from "@phosphor-icons/react";
import { assets } from "../../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebarCollapse, toggleSidebarOpen } from "../../store/uiSlice";
import type { RootState } from "../../app/store";
import { t } from "ttag";
import { useCurrentLanguage } from "../../hooks/useCurrentLanguage";
import { logout } from "../../features/auth/store/authSlice.ts";
import { useState } from "react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(
    (state: RootState) => state.ui.isSidebarCollapsed,
  );
  const isSidebarOpen = useSelector(
    (state: RootState) => state.ui.isSidebarOpen,
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
      setIsLoggingOut(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch(logout());
      navigate("/login");
  };

  useCurrentLanguage();

  const navItems = [
    {
      to: "/admin/dashboard",
      label: t`Dashboard`,
      icon: <ChartBar size={20} />,
    },
    {
      to: "/admin/listReport",
      label: t`Report List`,
      icon: <List size={20} />,
    },
    {
      to: "/admin/companyList",
      label: t`Company List`,
      icon: <Buildings size={20} />,
    },
    {
      to: "/admin/jobList",
      label: t`Job List`,
      icon: <ReadCvLogo size={20} />,
    },
    {
      to: "/admin/candidateList",
      label: t`Candidate List`,
      icon: <UsersFour size={20} />,
    },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 min-h-full bg-white border-r p-4 py-8 border-gray-300
        flex flex-col gap-4 shadow-lg transition-all duration-300
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0
      `}
      style={{ width: isCollapsed ? "5.5rem" : "16rem" }}
    >
      <div className="flex flex-col items-center gap-3 pb-4 mb-4 border-b-2 border-gray-200">
        <div
          className={`flex items-end gap-2 ${
            isCollapsed
              ? "flex-col justify-center w-full"
              : "justify-between w-full"
          }`}
        >
          <img
            src={isCollapsed ? assets.logoShort : assets.logoTitle}
            className={
              isCollapsed
                ? "object-contain h-[40px] w-[40px] m-auto"
                : "object-contain h-[58px]"
            }
            alt="Logo"
          />
          <h2
            className={`text-blue-700 font-bold mb-[2px] text-2xl ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            Admin
          </h2>
        </div>
      </div>

      <nav className="flex flex-col gap-[12px] font-medium text-md flex-grow">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => dispatch(toggleSidebarOpen(false))}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-[12px] rounded-lg transition
              ${
                isActive
                  ? "bg-blue-500 text-white font-semibold shadow"
                  : "text-gray-500 hover:bg-blue-100 hover:text-blue-600"
              }`
            }
          >
            {icon}
            {!isCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-gray-200">
        <button
          className="flex items-center gap-3 px-4 py-2 w-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
          onClick={() => dispatch(toggleSidebarCollapse())}
          aria-label="Toggle Sidebar Collapse"
        >
          <SidebarSimple size={20} />
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
      {/* Nút Logout */}
      <div className="">
        <button
          className="flex items-center gap-3 px-4 py-2 w-full text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
          onClick={() => handleLogout()}
          aria-label="Logout"
        >
          <SignOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;