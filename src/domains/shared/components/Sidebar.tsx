"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiBriefcase, FiSearch, FiSettings, FiHome } from "react-icons/fi";

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const nav = (path: string) => {
    setActiveTab?.("");
    router.push(path);
  };

  const navItems = [
    { path: "/", label: "Início", icon: <FiHome />, exact: true },
    { path: "/cotacoes", label: "Cotações", icon: <FiBriefcase /> },
    { path: "/busca-ans", label: "Busca ANS", icon: <FiSearch />, badge: "beta" },
    { path: "/configuracoes", label: "Configurações", icon: <FiSettings /> },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.path;
    return pathname.startsWith(item.path);
  };

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
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => nav(item.path)}
            className={`flex items-center justify-between py-3 px-4 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 border-none w-full text-left ${
              isItemActive(item)
                ? "bg-teal-50 text-teal-600"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 bg-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] bg-slate-100 text-slate-500 py-0.5 px-1.5 rounded font-semibold uppercase">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-1">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Versão</span>
        <span className="text-xs text-slate-500">v1.0.0</span>
      </div>
    </aside>
  );
}
