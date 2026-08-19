import React from "react";
import { useForm } from "react-hook-form";
import { Life } from "../types";
import { calculateAge } from "../calculator";

interface LivesProps {
  lives: Life[];
  onUpdateLives: (lives: Life[]) => void;
  onBack: () => void;
  onNext: () => void;
}

interface LifeFormInput {
  name: string;
  birthDate: string;
}

export function QuotationLives({ lives, onUpdateLives, onBack, onNext }: LivesProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LifeFormInput>();

  const onAddLife = (data: LifeFormInput) => {
    const newLife: Life = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      birthDate: data.birthDate,
      age: calculateAge(data.birthDate),
      price: 0,
    };
    onUpdateLives([...lives, newLife]);
    reset();
  };

  const handleRemoveLife = (id: string) => {
    onUpdateLives(lives.filter((life) => life.id !== id));
  };

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Gerenciamento de Vidas</h2>
      
      <form onSubmit={handleSubmit(onAddLife)} style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="form-group" style={{ flex: 2, marginBottom: 0, minWidth: "150px" }}>
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nome da pessoa"
            {...register("name", { required: "Nome é obrigatório", minLength: { value: 3, message: "Mínimo 3 letras" } })}
          />
          {errors.name && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.name.message}</span>}
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0, minWidth: "120px" }}>
          <label className="form-label">Nascimento</label>
          <input
            type="date"
            className="form-input"
            {...register("birthDate", { required: "Obrigatório" })}
          />
          {errors.birthDate && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.birthDate.message}</span>}
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
                      style={{ background: "none", border: "none", color: "var(--slate-400)", cursor: "pointer", fontSize: "0.75rem" }}
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
