import React from "react";
import { FiBriefcase, FiSearch, FiSettings } from "react-icons/fi";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{
          width: "28px",
          height: "28px",
          backgroundColor: "#ffd700",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          color: "var(--slate-900)",
          fontSize: "1.1rem"
        }}>
          P
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--slate-900)", lineHeight: 1.1 }}>
            painel <span style={{ fontWeight: 400 }}>do</span>
          </span>
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--slate-900)", lineHeight: 1.1 }}>
            corretor
          </span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <div
          onClick={() => setActiveTab("cotações")}
          className={`sidebar-item ${activeTab === "cotações" ? "active" : ""}`}
        >
          <FiBriefcase />
          <span>Cotações</span>
        </div>

        <div
          onClick={() => setActiveTab("busca")}
          className={`sidebar-item ${activeTab === "busca" ? "active" : ""}`}
          style={{ justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <FiSearch />
            <span>Busca ANS</span>
          </div>
          <span style={{
            fontSize: "0.625rem",
            backgroundColor: "var(--slate-100)",
            color: "var(--slate-500)",
            padding: "0.125rem 0.375rem",
            borderRadius: "4px",
            fontWeight: 600,
            textTransform: "uppercase"
          }}>
            beta
          </span>
        </div>

        <div
          onClick={() => setActiveTab("configurações")}
          className={`sidebar-item ${activeTab === "configurações" ? "active" : ""}`}
        >
          <FiSettings />
          <span>Configurações</span>
        </div>
      </nav>
    </aside>
  );
}
