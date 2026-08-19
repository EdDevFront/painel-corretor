import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { QuotationPreferences as Prefs } from "../types";
import { Operator } from "../../operator/types";
import { getOperators } from "../../operator/service";

interface PreferencesProps {
  initialPreferences: Prefs;
  onSubmit: (preferences: Prefs) => void;
  onBack: () => void;
}

export function QuotationPreferences({ initialPreferences, onSubmit, onBack }: PreferencesProps) {
  const [operators, setOperators] = useState<Operator[]>([]);
  const { register, handleSubmit } = useForm<Prefs>({
    defaultValues: {
      operatorId: initialPreferences.operatorId,
      hospitalNetwork: initialPreferences.hospitalNetwork,
      coparticipation: initialPreferences.coparticipation,
    }
  });

  useEffect(() => {
    getOperators().then(setOperators);
  }, []);

  const onFormSubmit = (data: Prefs) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Preferências e Filtros</h2>

      <div className="form-group">
        <label className="form-label">Filtrar Operadora Preferencial</label>
        <select className="form-select" {...register("operatorId")}>
          <option value="">Todas as Operadoras (Comparativo)</option>
          {operators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Rede Hospitalar</label>
        <select className="form-select" {...register("hospitalNetwork")}>
          <option value="standard">Padrão (Rede Básica + Média)</option>
          <option value="premium">Premium (Rede Ampla + Hospitais de Referência)</option>
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1.5rem 0" }}>
        <input
          type="checkbox"
          id="coparticipation"
          {...register("coparticipation")}
          style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer", accentColor: "var(--teal-600)" }}
        />
        <label htmlFor="coparticipation" style={{ fontSize: "0.875rem", fontWeight: 500, cursor: "pointer" }}>
          Plano com Coparticipação (mensalidade mais barata)
        </label>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onBack}>
          Voltar
        </button>
        <button type="submit" className="btn-primary" style={{ flex: 1 }}>
          Calcular Resultados
        </button>
      </div>
    </form>
  );
}
