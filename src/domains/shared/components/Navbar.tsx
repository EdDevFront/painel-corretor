import React from "react";
import { FiBell, FiUser } from "react-icons/fi";

export function Navbar() {
  return (
    <header className="navbar">
      <button style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--slate-500)",
        fontSize: "1.25rem",
        display: "flex",
        alignItems: "center"
      }}>
        <FiBell />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "var(--slate-100)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--slate-600)"
        }}>
          <FiUser />
        </div>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--slate-700)" }}>
          Luiz
        </span>
      </div>
    </header>
  );
}
