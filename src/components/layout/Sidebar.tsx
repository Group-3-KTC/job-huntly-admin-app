import { NavLink } from "react-router-dom";
import {
  ChartBar,
  List,
  Buildings,
  UsersFour,
  ReadCvLogo,
  SidebarSimple,
} from "@phosphor-icons/react";
import { assets } from "../../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/uiSlice";
import type { RootState } from "../../app/store";
import { t } from "ttag";
import { useEffect, useState } from "react";
import { subscribeToLanguageChange } from "../../i18n/i18n";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(
    (state: RootState) => state.ui.isSidebarCollapsed
  );
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handleLangChange = () => {
      forceUpdate((prev) => prev + 1);
    };
    const unsubscribe = subscribeToLanguageChange(handleLangChange);

    return unsubscribe;
  }, []);

  const navItems = [
    {
      to: "dashboard",
      label: t`Dashboard`,
      icon: <ChartBar size={20} />,
    },
    { to: "listReport", label: t`Report List`, icon: <List size={20} /> },
    {
      to: "companyList",
      label: t`Company List`,
      icon: <Buildings size={20} />,
    },
    { to: "jobList", label: t`Job List`, icon: <ReadCvLogo size={20} /> },
    {
      to: "candidateList",
      label: t`Candidate List`,
      icon: <UsersFour size={20} />,
    },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 min-h-full bg-white border-r p-4 py-8 z-40 border-gray-300 
        flex flex-col gap-4 shadow-lg transition-all duration-300
      `}
      style={{ width: isCollapsed ? "5.5rem" : "16rem" }}
    >
      {/* Logo & toggle button */}
      <div className="flex flex-col items-center gap-3 border-b-2 pb-4 mb-4 border-gray-200">
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

        {/* Nút collapse */}
        <div
          className={`w-full flex ${
            isCollapsed ? "justify-center" : "justify-end"
          }`}
        >
          <button
            className="text-gray-500 hover:text-blue-600"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle Sidebar"
          >
            <SidebarSimple size={24} />
          </button>
        </div>
      </div>

      {/* Menu navigation */}
      <nav className="flex flex-col gap-[12px] font-medium text-md">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
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
    </div>
  );
};

export default Sidebar;
