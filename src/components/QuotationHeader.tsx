import React from "react";

interface HeaderProps {
  clientName?: string;
  status?: string;
}

export function QuotationHeader({ clientName, status }: HeaderProps) {
  const displayStatus = status || "Rascunho";
  
  return (
    <header className="quotation-header" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid var(--slate-200)",
      paddingBottom: "1.5rem",
      marginBottom: "2rem",
      width: "100%",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div className="status-badge" style={{ padding: "0.5rem 0.75rem" }}>
          <span className="pulse-dot"></span>
          <span>{displayStatus}</span>
        </div>
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>VITALIS</h1>
          {clientName && (
            <p style={{ fontSize: "0.875rem", color: "var(--slate-500)", margin: 0 }}>
              Cotação para: <strong>{clientName}</strong>
            </p>
          )}
        </div>
      </div>
      <div>
        <span style={{ fontSize: "0.75rem", color: "var(--slate-400)", fontFamily: "monospace" }}>
          v1.0.0
        </span>
      </div>
    </header>
  );
}
