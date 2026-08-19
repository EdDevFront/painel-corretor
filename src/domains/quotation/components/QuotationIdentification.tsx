import React from "react";
import { useForm } from "react-hook-form";
import { QuotationMode } from "../types";

interface IdentificationProps {
  onSubmit: (clientName: string, brokerName: string, mode: QuotationMode) => void;
  initialClient?: string;
  initialBroker?: string;
  initialMode?: QuotationMode;
}

interface FormInputs {
  clientName: string;
  brokerName: string;
  mode: QuotationMode;
}

export function QuotationIdentification({
  onSubmit,
  initialClient = "",
  initialBroker = "",
  initialMode = "PF",
}: IdentificationProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      clientName: initialClient,
      brokerName: initialBroker,
      mode: initialMode,
    }
  });

  const onFormSubmit = (data: FormInputs) => {
    onSubmit(data.clientName, data.brokerName, data.mode);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Identificação da Cotação</h2>
      
      <div className="form-group">
        <label className="form-label">Nome do Cliente</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: João Silva ou Empresa XYZ"
          {...register("clientName", { 
            required: "Nome do cliente é obrigatório", 
            minLength: { value: 3, message: "Mínimo de 3 caracteres" } 
          })}
        />
        {errors.clientName && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.clientName.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Nome do Corretor</label>
        <input
          type="text"
          className="form-input"
          placeholder="Seu Nome completo"
          {...register("brokerName", { 
            required: "Nome do corretor é obrigatório", 
            minLength: { value: 3, message: "Mínimo de 3 caracteres" } 
          })}
        />
        {errors.brokerName && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.brokerName.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Modalidade de Cotação</label>
        <select className="form-select" {...register("mode", { required: true })}>
          <option value="PF">Pessoa Física (PF)</option>
          <option value="PME">Pequena e Média Empresa (PME)</option>
          <option value="ADESAO">Coletivo por Adesão</option>
        </select>
      </div>

      <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
        Prosseguir
      </button>
    </form>
  );
}
