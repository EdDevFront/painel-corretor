import React from "react";
import { FiBell, FiUser } from "react-icons/fi";

export function Navbar() {
  return (
    <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-end px-10 gap-6">
      <button className="bg-transparent border-none cursor-pointer text-slate-500 text-xl flex items-center hover:text-slate-800 transition-colors">
        <FiBell />
      </button>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <FiUser />
        </div>
        <span className="text-sm font-semibold text-slate-700">
          Luiz
        </span>
      </div>
    </header>
  );
}
