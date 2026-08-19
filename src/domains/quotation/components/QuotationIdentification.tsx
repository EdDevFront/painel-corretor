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
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs max-w-[500px] mx-auto">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Identificação da Cotação</h2>
      
      <div className="flex flex-col gap-1.5 mb-5">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Nome do Cliente</label>
        <input
          type="text"
          className="border border-slate-200 rounded-md py-2 px-3 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm"
          placeholder="Ex: João Silva ou Empresa XYZ"
          {...register("clientName", { 
            required: "Nome do cliente é obrigatório", 
            minLength: { value: 3, message: "Mínimo de 3 caracteres" } 
          })}
        />
        {errors.clientName && <span className="text-red-500 text-xs mt-0.5">{errors.clientName.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5 mb-5">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Nome do Corretor</label>
        <input
          type="text"
          className="border border-slate-200 rounded-md py-2 px-3 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm"
          placeholder="Seu Nome completo"
          {...register("brokerName", { 
            required: "Nome do corretor é obrigatório", 
            minLength: { value: 3, message: "Mínimo de 3 caracteres" } 
          })}
        />
        {errors.brokerName && <span className="text-red-500 text-xs mt-0.5">{errors.brokerName.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Modalidade de Cotação</label>
        <select 
          className="border border-slate-200 rounded-md py-2 px-3 bg-white focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm"
          {...register("mode", { required: true })}
        >
          <option value="PF">Pessoa Física (PF)</option>
          <option value="PME">Pequena e Média Empresa (PME)</option>
          <option value="ADESAO">Coletivo por Adesão</option>
        </select>
      </div>

      <button type="submit" className="w-full flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white py-2.5 px-5 rounded-lg hover:bg-slate-800 cursor-pointer transition-all shadow-md shadow-slate-200">
        Prosseguir
      </button>
    </form>
  );
}
