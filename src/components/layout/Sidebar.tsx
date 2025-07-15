import { NavLink } from "react-router-dom";
import { ChartBar, List, Buildings, X } from "@phosphor-icons/react";
import { useState } from "react";
import { assets } from "../../assets/assets";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <ChartBar size={20} /> },
  { to: "/listReport", label: "Report List", icon: <List size={20} /> },
  { to: "/companyList", label: "Company List", icon: <Buildings size={20} /> },
  {
    to: "/candidateList",
    label: "Candidate List",
    icon: <Buildings size={20} />,
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

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
          fixed top-0 left-0 min-h-full w-64 bg-white border-r p-4 py-8 z-40 border-gray-300 
          flex-col gap-4 shadow-lg transition-transform duration-300
          ${open ? "flex translate-x-0" : "translate-x-[-100%]"}
          md:translate-x-0 md:flex md:static md:shadow-none 
        `}
      >
        {/* Logo & nút đóng (mobile) */}
        <div className="flex items-end justify-between mb-4 md:mb-6">
          <div className="flex items-end">
            <img
              src={assets.logoTitle}
              className="object-contain w-[50%] md:w-[78%] md:h-[58px]"
              alt=""
            />
            <h2 className="ml-[2px] text-blue-700 text-md font-medium md:text-2xl md:font-bold mb-[1px]">
              Admin
            </h2>
          </div>
          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav items */}
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
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay (mobile) */}
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
