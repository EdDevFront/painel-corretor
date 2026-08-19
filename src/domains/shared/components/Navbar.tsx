import React from "react";
import { FiBell, FiUser, FiMenu, FiX } from "react-icons/fi";
import { IconButton } from "../../../components/ui/IconButton";

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  return (
    <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between md:justify-end px-4 md:px-10 gap-6">
      {/* Mobile Toggle Button */}
      <IconButton 
        onClick={onToggleSidebar}
        className="md:hidden border-none bg-transparent hover:bg-slate-50 p-2"
      >
        {isSidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </IconButton>

      <div className="flex items-center gap-6">
        <IconButton 
          className="border-none bg-transparent hover:bg-slate-50 p-2 text-xl flex items-center text-slate-500 hover:text-slate-800"
        >
          <FiBell />
        </IconButton>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <FiUser />
          </div>
          <span className="text-sm font-semibold text-slate-700">
            Luiz
          </span>
        </div>
      </div>
    </header>
  );
}
