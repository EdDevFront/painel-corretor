import React from "react";
import { useForm } from "react-hook-form";
import { QuotationMode } from "../types";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";

interface IdentificationProps {
  onSubmit: (title: string, clientName: string, brokerName: string, mode: QuotationMode) => void;
  onBack: () => void;
  initialTitle?: string;
  initialClient?: string;
  initialBroker?: string;
  initialMode?: QuotationMode;
  isLoading?: boolean;
}

interface FormInputs {
  title: string;
  clientName: string;
  brokerName: string;
  mode: QuotationMode;
}

export function QuotationIdentification({
  onSubmit,
  onBack,
  initialTitle = "",
  initialClient = "",
  initialBroker = "",
  initialMode = "PF",
  isLoading = false,
}: IdentificationProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      title: initialTitle,
      clientName: initialClient,
      brokerName: initialBroker,
      mode: initialMode,
    }
  });

  const onFormSubmit = (data: FormInputs) => {
    onSubmit(data.title, data.clientName, data.brokerName, data.mode);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border border-slate-100 rounded-lg p-6 md:p-8 shadow-xs max-w-[800px] mx-auto w-full">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Identificação da Cotação</h2>
      
      <div className="mb-4">
        <Input
          label="Título da Cotação"
          placeholder="Ex: Cotação Diretores, Plano Familiar, etc."
          error={errors.title?.message}
          disabled={isLoading}
          {...register("title", { 
            required: "Título da cotação é obrigatório", 
            minLength: { value: 3, message: "Mínimo de 3 caracteres" } 
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mb-2">
        <div>
          <Input
            label="Nome do Cliente"
            placeholder="Ex: João Silva ou Empresa XYZ"
            error={errors.clientName?.message}
            disabled={isLoading}
            {...register("clientName", { 
              required: "Nome do cliente é obrigatório", 
              minLength: { value: 3, message: "Mínimo de 3 caracteres" } 
            })}
          />
        </div>

        <div>
          <Select
            label="Nome do Corretor"
            error={errors.brokerName?.message}
            disabled={isLoading}
            {...register("brokerName", { 
              required: "Nome do corretor é obrigatório"
            })}
          >
            <option value="">Selecione o Corretor</option>
            <option value="Beltrano Silva">Beltrano Silva</option>
            <option value="Ana Souza">Ana Souza</option>
            <option value="Carlos Oliveira">Carlos Oliveira</option>
            <option value="Fernanda Santos">Fernanda Santos</option>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <Select 
          label="Modalidade de Cotação"
          disabled={isLoading}
          {...register("mode", { required: true })}
        >
          <option value="PF">Pessoa Física (PF)</option>
          <option value="PME">Pequena e Média Empresa (PME)</option>
          <option value="ADESAO">Coletivo por Adesão</option>
        </Select>
      </div>

      <div className="flex gap-4 mt-6">
        <Button type="submit" size="lg" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
          {isLoading && (
            <div className="animate-spin-custom rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          )}
          Prosseguir
        </Button>
      </div>
    </form>
  );
}
