import React from "react";
import { Bell, MagnifyingGlass } from "@phosphor-icons/react";

const Header = () => {
  return (
    <div className="flex items-center justify-between mx-4 px-4 py-3 bg-white shadow-sm rounded-md">
      {/* Search input */}
      <div className="flex items-center w-full max-w-sm bg-gray-100 px-3 py-2 rounded-full">
        <MagnifyingGlass size={20} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search charts..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5 ml-4">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell size={22} className="text-blue-500" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            9
          </span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40?img=5"
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-right text-sm">
            <p className="font-medium">Moni Roy</p>
            <p className="text-gray-400 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
