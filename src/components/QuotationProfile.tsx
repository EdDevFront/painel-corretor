import React, { useState } from "react";

interface ProfileProps {
  onBack: () => void;
  onSubmit: (accommodation: string, region: string) => void;
  initialAccommodation?: string;
  initialRegion?: string;
}

export function QuotationProfile({
  onBack,
  onSubmit,
  initialAccommodation = "apartamento",
  initialRegion = "nacional",
}: ProfileProps) {
  const [accommodation, setAccommodation] = useState(initialAccommodation);
  const [region, setRegion] = useState(initialRegion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(accommodation, region);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Configurações do Plano</h2>

      <div className="form-group">
        <label className="form-label">Acomodação</label>
        <select
          className="form-select"
          value={accommodation}
          onChange={(e) => setAccommodation(e.target.value)}
        >
          <option value="enfermaria">Enfermaria (Coletiva)</option>
          <option value="apartamento">Apartamento (Individual)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Abrangência Geográfica</label>
        <select
          className="form-select"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="nacional">Nacional</option>
          <option value="regional">Regional</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onBack}>
          Voltar
        </button>
        <button type="submit" className="btn-primary" style={{ flex: 1 }}>
          Prosseguir
        </button>
      </div>
    </form>
  );
}
