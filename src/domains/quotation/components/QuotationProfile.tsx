import React from "react";
import { useForm } from "react-hook-form";
import { Select } from "../../shared/components/ui/Select";
import { Button } from "../../shared/components/ui/Button";

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
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs max-w-[500px] mx-auto">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Configurações do Plano</h2>

      <div className="mb-5">
        <Select label="Acomodação" {...register("accommodation")}>
          <option value="enfermaria">Enfermaria (Coletiva)</option>
          <option value="apartamento">Apartamento (Individual)</option>
        </Select>
      </div>

      <div className="mb-6">
        <Select label="Abrangência Geográfica" {...register("region")}>
          <option value="nacional">Nacional</option>
          <option value="regional">Regional</option>
        </Select>
      </div>

      <div className="flex gap-4 mt-6">
        <Button type="button" variant="secondary" className="flex-1" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" className="flex-1">
          Prosseguir
        </Button>
      </div>
    </form>
  );
}
