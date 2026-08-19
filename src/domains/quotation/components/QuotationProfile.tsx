import React from "react";
import { useForm } from "react-hook-form";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";

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
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border border-slate-100 rounded-lg p-6 md:p-8 shadow-xs max-w-[800px] mx-auto w-full">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Configurações do Plano</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mb-4">
        <div>
          <Select label="Acomodação" {...register("accommodation")}>
            <option value="enfermaria">Enfermaria (Coletiva)</option>
            <option value="apartamento">Apartamento (Individual)</option>
          </Select>
        </div>

        <div>
          <Select label="Abrangência Geográfica" {...register("region")}>
            <option value="nacional">Nacional</option>
            <option value="regional">Regional</option>
          </Select>
        </div>
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
