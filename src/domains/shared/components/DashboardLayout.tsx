"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function DashboardLayout({ children, activeTab = "cotações", setActiveTab }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-row min-h-screen w-full relative">
      <div className={`
        fixed inset-y-0 left-0 z-50 md:sticky md:block transition-transform duration-300 md:translate-x-0 no-print
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
          setActiveTab?.(tab);
          setIsSidebarOpen(false);
        }} />
      </div>

      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}
      
      <div className="flex flex-col flex-1 bg-slate-50 min-w-0">
        <div className="no-print">
          <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>
        
        <main className="p-4 md:p-10 flex-1 overflow-y-auto relative min-w-0">
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="glow-blue"></div>
            <div className="glow-teal"></div>
          </div>
          <div className="relative z-10 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
