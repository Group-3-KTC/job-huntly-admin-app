import { NavLink } from "react-router-dom";
import {
  ChartBar,
  List,
  Buildings,
  X,
  UsersFour,
  ReadCvLogo,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { SidebarSimple } from "phosphor-react";
import { t, subscribeToLanguageChange } from "../../i18n/i18n";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [isHide, setIsHide] = useState(true);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate((prev) => prev + 1); // Force component re-render
    };

    subscribeToLanguageChange(handleLanguageChange);

    return () => {
      subscribeToLanguageChange(() => {});
    };
  }, []);

  const navItems = [
    { to: "/dashboard", label: t`Dashboard`, icon: <ChartBar size={20} /> },
    { to: "/listReport", label: t`Report List`, icon: <List size={20} /> },
    {
      to: "/companyList",
      label: t`Company List`,
      icon: <Buildings size={20} />,
    },
    { to: "/jobList", label: t`Job List`, icon: <ReadCvLogo size={20} /> },
    {
      to: "/candidateList",
      label: t`Candidate List`,
      icon: <UsersFour size={20} />,
    },
  ];

  return (
    <>
      {/* Button mở menu (mobile) */}
      <button
        className={`fixed top-4 left-4 z-50 text-blue-500 md:hidden transition-opacity duration-300 ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <List size={28} />
      </button>

      {/* Sidebar chính */}
      <div
        className={`
          fixed top-0 left-0 min-h-full bg-white border-r p-4 py-8 z-40 border-gray-300 
          flex-col gap-4 shadow-lg transition-all duration-300
          ${open ? "flex translate-x-0" : "translate-x-[-100%]"}
          ${isHide ? "min-w-64" : "min-w-22 max-w-22"}
          md:translate-x-0 md:flex md:static md:shadow-none
        `}
        style={{ width: isHide ? "16rem" : "5.5rem" }} // Use rem for consistency
      >
        {/* Logo & nút đóng (mobile) */}
        <div className="flex flex-col items-center gap-3 border-b-2 pb-4 mb-4 border-gray-200">
          <div
            className={`flex items-end gap-2 ${
              isHide
                ? "justify-between w-full"
                : "flex-col justify-center w-full"
            } `}
          >
            <img
              src={isHide ? assets.logoTitle : assets.logoShort}
              className={
                isHide
                  ? `object-contain h-[58px]`
                  : `object-contain h-[40px] w-[40px] m-auto`
              }
              alt="Logo"
            />
            <h2
              className={`text-blue-700 font-bold mb-[2px] text-2xl ${
                isHide ? "block" : "hidden"
              }`}
            >
              Admin
            </h2>
          </div>
          <div
            className={`w-full flex ${
              isHide ? "justify-end" : "justify-center"
            }`}
          >
            <button
              className="text-gray-500 hover:text-blue-600"
              onClick={() => setIsHide(!isHide)}
              aria-label="Toggle Sidebar"
            >
              <SidebarSimple size={24} />
            </button>
          </div>
          <button
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-blue-600"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
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
              onClick={() => setOpen(false)}
            >
              {icon}
              {isHide && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
