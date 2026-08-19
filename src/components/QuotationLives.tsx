import React, { useState } from "react";
import { Life } from "../types/quotation";
import { calculateAge } from "../services/quotation.calculator";

interface LivesProps {
  lives: Life[];
  onUpdateLives: (lives: Life[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function QuotationLives({ lives, onUpdateLives, onBack, onNext }: LivesProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleAddLife = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate) return;

    const newLife: Life = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      birthDate,
      age: calculateAge(birthDate),
      price: 0, // Will be computed by service/calculator
    };

    onUpdateLives([...lives, newLife]);
    setName("");
    setBirthDate("");
  };

  const handleRemoveLife = (id: string) => {
    onUpdateLives(lives.filter((life) => life.id !== id));
  };

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Gerenciamento de Vidas</h2>
      
      <form onSubmit={handleAddLife} style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "flex-end" }}>
        <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nome da pessoa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label className="form-label">Nascimento</label>
          <input
            type="date"
            className="form-input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary" style={{ height: "42px" }}>
          Adicionar
        </button>
      </form>

      {lives.length === 0 ? (
        <p style={{ color: "var(--slate-400)", textAlign: "center", margin: "2rem 0" }}>
          Nenhuma vida cadastrada nesta cotação.
        </p>
      ) : (
        <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th style={{ padding: "0.75rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--slate-500)" }}>Nome</th>
                <th style={{ padding: "0.75rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--slate-500)" }}>Nascimento</th>
                <th style={{ padding: "0.75rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--slate-500)" }}>Idade</th>
                <th style={{ padding: "0.75rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--slate-500)", textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lives.map((life) => (
                <tr key={life.id} style={{ borderBottom: "1px solid var(--slate-100)" }}>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--slate-900)" }}>{life.name}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "var(--slate-500)" }}>
                    {new Date(life.birthDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "var(--slate-900)", fontWeight: 600 }}>{life.age} anos</td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveLife(life.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--slate-400)",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--slate-400)")}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onBack}>
          Voltar
        </button>
        <button
          type="button"
          className="btn-primary"
          style={{ flex: 1 }}
          onClick={onNext}
          disabled={lives.length === 0}
        >
          Prosseguir
        </button>
      </div>
    </div>
  );
}
