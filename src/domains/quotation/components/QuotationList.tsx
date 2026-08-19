import React, { useState } from "react";
import { Quotation } from "../types";
import { FiPlus, FiSearch, FiSliders } from "react-icons/fi";

interface ListProps {
  quotations: Quotation[];
  onSelectQuotation: (id: string) => void;
  onNewQuotation: () => void;
}

export function QuotationList({ quotations, onSelectQuotation, onNewQuotation }: ListProps) {
  const [search, setSearch] = useState("");

  const filtered = quotations.filter(
    (q) => q.clientName.toLowerCase().includes(search.toLowerCase()) ||
           q.brokerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem" }}>Cotações</h1>
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 3, minWidth: "300px" }}>
          {/* Controls Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--slate-200)", borderRadius: "6px", padding: "0.25rem 0.75rem", background: "#fff", flex: 1, maxWidth: "300px" }}>
              <FiSearch style={{ color: "var(--slate-400)", marginRight: "0.5rem" }} />
              <input
                type="text"
                placeholder="Procurar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", fontSize: "0.875rem", width: "100%", height: "30px" }}
              />
            </div>
            <button className="btn-secondary" style={{ padding: "0.5rem" }}>
              <FiSliders />
            </button>
            <button className="btn-primary" onClick={onNewQuotation} style={{ gap: "0.5rem", borderRadius: "6px", textTransform: "none" }}>
              <FiPlus /> Nova
            </button>
          </div>

          {/* Quotations Table */}
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--slate-200)", background: "var(--slate-50)" }}>
                  <th style={{ padding: "1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--slate-500)" }}>Título</th>
                  <th style={{ padding: "1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--slate-500)" }}>Criada por</th>
                  <th style={{ padding: "1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--slate-500)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "var(--slate-400)" }}>
                      Nenhuma cotação cadastrada.
                    </td>
                  </tr>
                ) : (
                  filtered.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => onSelectQuotation(q.id)}
                      style={{ borderBottom: "1px solid var(--slate-100)", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--slate-50)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ padding: "1rem", fontWeight: 600, color: "var(--slate-900)" }}>
                        {q.clientName}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: 500, color: "var(--slate-800)" }}>{q.brokerName}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--slate-400)" }}>
                          {new Date(q.createdAt).toLocaleDateString("pt-BR")}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--slate-500)" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: q.status === "completed" ? "var(--emerald-500)" : "var(--slate-400)" }}></span>
                          {q.status === "completed" ? "Finalizada" : "Rascunho"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Metrics Column */}
        <div style={{ flex: 1, minWidth: "220px", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card">
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, color: "var(--slate-400)" }}>Cadastradas</span>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--slate-900)", marginTop: "0.5rem" }}>
              {quotations.length}
            </div>
          </div>
          <div className="card">
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, color: "var(--slate-400)" }}>Visualizadas</span>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--slate-400)", marginTop: "0.5rem" }}>
              -
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
