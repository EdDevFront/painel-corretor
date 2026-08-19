import React from "react";
import { useForm } from "react-hook-form";
import { QuotationMode } from "../types";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { Button } from "../../../../components/ui/Button";

interface IdentificationProps {
  onSubmit: (clientName: string, brokerName: string, mode: QuotationMode) => void;
  onBack: () => void;
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
  onBack,
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border border-slate-100 rounded-lg p-6 md:p-8 shadow-xs max-w-[800px] mx-auto w-full">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Identificação da Cotação</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mb-2">
        <div>
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

        <div>
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

      <div className="flex gap-4 mt-6">
        <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" size="lg" className="flex-1">
          Prosseguir
        </Button>
      </div>
    </form>
  );
}
