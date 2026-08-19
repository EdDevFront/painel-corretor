import React from "react";
import { Quotation, OperatorResult } from "../types";

interface ResultsProps {
  quotation: Quotation;
  onRestart: () => void;
  onBack: () => void;
}

export function QuotationResults({ quotation, onRestart, onBack }: ResultsProps) {
  const results = quotation.results;
  const preferredOp = quotation.preferences.operatorId;

  if (!results) {
    return <div className="card">Nenhum resultado de cálculo disponível.</div>;
  }

  const displayedResults = preferredOp
    ? results.operatorResults.filter((r) => r.operatorId === preferredOp)
    : [...results.operatorResults].sort((a, b) => a.totalPrice - b.totalPrice);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Resultados da Cotação</h2>
        <button className="btn-secondary" onClick={onRestart}>Nova Cotação</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {displayedResults.map((opResult: OperatorResult) => (
          <div key={opResult.operatorId} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <span className="status-badge" style={{ marginBottom: "0.5rem" }}>Operadora</span>
              <h3 style={{ fontSize: "1.5rem", color: "var(--slate-900)" }}>{opResult.operatorName}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--slate-500)", marginTop: "0.25rem" }}>
                Total para {results.totalLives} {results.totalLives === 1 ? "vida" : "vidas"}
              </p>
            </div>
            
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--slate-400)", fontWeight: 600 }}>Valor Mensal</span>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--teal-600)" }}>
                R$ {opResult.totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--slate-400)" }}>
                + R$ {results.baseFees.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} taxa adm.
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: "var(--slate-100)", border: "none", marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Resumo Técnico da Cotação</h4>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
          <span>Cliente:</span>
          <strong>{quotation.clientName}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
          <span>Corretor:</span>
          <strong>{quotation.brokerName}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
          <span>Modalidade:</span>
          <strong>{quotation.mode === "PF" ? "Pessoa Física (PF)" : quotation.mode === "PME" ? "Pequena e Média Empresa (PME)" : "Adesão"}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
          <span>Coparticipação:</span>
          <strong>{quotation.preferences.coparticipation ? "Sim" : "Não"}</strong>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onBack}>
          Voltar e Editar
        </button>
        <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={() => window.print()}>
          Imprimir / PDF
        </button>
      </div>
    </div>
  );
}
