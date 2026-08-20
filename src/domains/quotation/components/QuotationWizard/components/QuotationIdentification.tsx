import React from "react";
import { useForm } from "react-hook-form";
import { QuotationMode } from "../../../types";
import { Input } from "../../../../../components/ui/Input/Input";
import { Select } from "../../../../../components/ui/Select";
import { Button } from "../../../../../components/ui/Button";

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
      <h2 className="text-xl font-bold text-slate-900 mb-6">IdentificaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o da CotaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o</h2>
      
      <div className="mb-4">
        <Input
          label="TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­tulo da CotaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o"
          placeholder="Ex: CotaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Diretores, Plano Familiar, etc."
          error={errors.title?.message}
          disabled={isLoading}
          {...register("title", { 
            required: "TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­tulo da cotaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rio", 
            minLength: { value: 3, message: "MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nimo de 3 caracteres" } 
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mb-2">
        <div>
          <Input
            label="Nome do Cliente"
            placeholder="Ex: JoÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Silva ou Empresa XYZ"
            error={errors.clientName?.message}
            disabled={isLoading}
            {...register("clientName", { 
              required: "Nome do cliente ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rio", 
              minLength: { value: 3, message: "MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nimo de 3 caracteres" } 
            })}
          />
        </div>

        <div>
          <Select
            label="Nome do Corretor"
            error={errors.brokerName?.message}
            disabled={isLoading}
            {...register("brokerName", { 
              required: "Nome do corretor ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rio"
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
          label="Modalidade de CotaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o"
          disabled={isLoading}
          {...register("mode", { required: true })}
        >
          <option value="PF">Pessoa FÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­sica (PF)</option>
          <option value="PME">Pequena e MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©dia Empresa (PME)</option>
          <option value="ADESAO">Coletivo por AdesÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o</option>
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
