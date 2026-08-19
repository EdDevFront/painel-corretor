import React from "react";
import { useForm } from "react-hook-form";

interface ProfileProps {
  onBack: () => void;
  onSubmit: (accommodation: string, region: string) => void;
  initialAccommodation?: string;
  initialRegion?: string;
}

interface FormInputs {
  accommodation: string;
  region: string;
}

export function QuotationProfile({
  onBack,
  onSubmit,
  initialAccommodation = "apartamento",
  initialRegion = "nacional",
}: ProfileProps) {
  const { register, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      accommodation: initialAccommodation,
      region: initialRegion,
    }
  });

  const onFormSubmit = (data: FormInputs) => {
    onSubmit(data.accommodation, data.region);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Configurações do Plano</h2>

      <div className="form-group">
        <label className="form-label">Acomodação</label>
        <select className="form-select" {...register("accommodation")}>
          <option value="enfermaria">Enfermaria (Coletiva)</option>
          <option value="apartamento">Apartamento (Individual)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Abrangência Geográfica</label>
        <select className="form-select" {...register("region")}>
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
