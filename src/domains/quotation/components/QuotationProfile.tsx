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
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs max-w-[500px] mx-auto">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Configurações do Plano</h2>

      <div className="flex flex-col gap-1.5 mb-5">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Acomodação</label>
        <select 
          className="border border-slate-200 rounded-md py-2 px-3 bg-white focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm" 
          {...register("accommodation")}
        >
          <option value="enfermaria">Enfermaria (Coletiva)</option>
          <option value="apartamento">Apartamento (Individual)</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Abrangência Geográfica</label>
        <select 
          className="border border-slate-200 rounded-md py-2 px-3 bg-white focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm" 
          {...register("region")}
        >
          <option value="nacional">Nacional</option>
          <option value="regional">Regional</option>
        </select>
      </div>

      <div className="flex gap-4 mt-6">
        <button type="button" className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 py-2.5 px-5 rounded-lg hover:bg-slate-50 cursor-pointer transition-all" onClick={onBack}>
          Voltar
        </button>
        <button type="submit" className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white py-2.5 px-5 rounded-lg hover:bg-slate-800 cursor-pointer transition-all shadow-md shadow-slate-200">
          Prosseguir
        </button>
      </div>
    </form>
  );
}
