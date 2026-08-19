import React from "react";
import { FiBriefcase, FiSearch, FiSettings } from "react-icons/fi";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col p-6 h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-7 h-7 bg-amber-400 rounded-md flex items-center justify-center font-extrabold text-slate-900 text-lg">
          P
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold text-slate-900 leading-[1.1]">
            painel <span className="font-normal">do</span>
          </span>
          <span className="text-base font-extrabold text-slate-900 leading-[1.1]">
            corretor
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <div
          onClick={() => setActiveTab("cotações")}
          className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ${
            activeTab === "cotações" ? "bg-teal-50 text-teal-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <FiBriefcase />
          <span>Cotações</span>
        </div>

        <div
          onClick={() => setActiveTab("busca")}
          className={`flex items-center justify-between py-3 px-4 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ${
            activeTab === "busca" ? "bg-teal-50 text-teal-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <FiSearch />
            <span>Busca ANS</span>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-500 py-0.5 px-1.5 rounded font-semibold uppercase">
            beta
          </span>
        </div>

        <div
          onClick={() => setActiveTab("configurações")}
          className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ${
            activeTab === "configurações" ? "bg-teal-50 text-teal-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <FiSettings />
          <span>Configurações</span>
        </div>
      </nav>
    </aside>
  );
}
