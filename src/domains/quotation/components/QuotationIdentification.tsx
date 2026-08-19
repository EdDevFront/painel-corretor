import React from "react";
import { useForm } from "react-hook-form";
import { QuotationMode } from "../types";
import { Input } from "../../shared/components/ui/Input";
import { Select } from "../../shared/components/ui/Select";
import { Button } from "../../shared/components/ui/Button";

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
      
      <div className="mb-5">
        <Input
          label="Nome do Cliente"
          placeholder="Ex: João Silva ou Empresa XYZ"
          error={errors.clientName?.message}
          {...register("clientName", { 
            required: "Nome do cliente é obrigatório", 
            minLength: { value: 3, message: "Mínimo de 3 caracteres" } 
          })}
        />
      </div>

      <div className="mb-5">
        <Input
          label="Nome do Corretor"
          placeholder="Seu Nome completo"
          error={errors.brokerName?.message}
          {...register("brokerName", { 
            required: "Nome do corretor é obrigatório", 
            minLength: { value: 3, message: "Mínimo de 3 caracteres" } 
          })}
        />
      </div>

      <div className="mb-6">
        <Select 
          label="Modalidade de Cotação"
          {...register("mode", { required: true })}
        >
          <option value="PF">Pessoa Física (PF)</option>
          <option value="PME">Pequena e Média Empresa (PME)</option>
          <option value="ADESAO">Coletivo por Adesão</option>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Prosseguir
      </Button>
    </form>
  );
}
