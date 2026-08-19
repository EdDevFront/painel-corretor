import React, { useState } from "react";
import { QuotationMode } from "../types/quotation";

interface IdentificationProps {
  onSubmit: (clientName: string, brokerName: string, mode: QuotationMode) => void;
  initialClient?: string;
  initialBroker?: string;
  initialMode?: QuotationMode;
}

export function QuotationIdentification({
  onSubmit,
  initialClient = "",
  initialBroker = "",
  initialMode = "PF",
}: IdentificationProps) {
  const [clientName, setClientName] = useState(initialClient);
  const [brokerName, setBrokerName] = useState(initialBroker);
  const [mode, setMode] = useState<QuotationMode>(initialMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientName && brokerName) {
      onSubmit(clientName, brokerName, mode);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Identificação da Cotação</h2>
      
      <div className="form-group">
        <label className="form-label">Nome do Cliente</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: João Silva ou Empresa XYZ"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Nome do Corretor</label>
        <input
          type="text"
          className="form-input"
          placeholder="Seu Nome completo"
          value={brokerName}
          onChange={(e) => setBrokerName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Modalidade de Cotação</label>
        <select
          className="form-select"
          value={mode}
          onChange={(e) => setMode(e.target.value as QuotationMode)}
        >
          <option value="PF">Pessoa Física (PF)</option>
          <option value="PME">Pequena e Média Empresa (PME)</option>
          <option value="ADESAO">Coletivo por Adesão</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{ width: "100%", marginTop: "1rem" }}
        disabled={!clientName || !brokerName}
      >
        Prosseguir
      </button>
    </form>
  );
}
