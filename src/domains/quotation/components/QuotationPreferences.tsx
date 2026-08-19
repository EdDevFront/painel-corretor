import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { QuotationPreferences as Prefs } from "../types";
import { Operator } from "../../operator/types";
import { getOperators } from "../../operator/service";
import { FiChevronDown } from "react-icons/fi";

interface PreferencesProps {
  initialPreferences: Prefs;
  onSubmit: (preferences: Prefs) => void;
  onBack: () => void;
}

export function QuotationPreferences({ initialPreferences, onSubmit, onBack }: PreferencesProps) {
  const [operators, setOperators] = useState<Operator[]>([]);
  const { register, handleSubmit } = useForm<Prefs>({
    defaultValues: {
      operatorId: initialPreferences.operatorId,
      hospitalNetwork: initialPreferences.hospitalNetwork,
      coparticipation: initialPreferences.coparticipation,
    }
  });

  useEffect(() => {
    getOperators().then(setOperators);
  }, []);

  const onFormSubmit = (data: Prefs) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs max-w-[500px] mx-auto">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Preferências e Filtros</h2>

      <div className="flex flex-col gap-1.5 mb-5 relative">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Filtrar Operadora Preferencial</label>
        <div className="relative">
          <select 
            className="w-full appearance-none border border-slate-200 rounded-md py-2.5 pl-3 pr-10 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm bg-white cursor-pointer text-slate-800"
            {...register("operatorId")}
          >
            <option value="">Todas as Operadoras (Comparativo)</option>
            {operators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <FiChevronDown />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-5 relative">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Rede Hospitalar</label>
        <div className="relative">
          <select 
            className="w-full appearance-none border border-slate-200 rounded-md py-2.5 pl-3 pr-10 focus:outline-hidden focus:border-teal-500 focus:ring-3 focus:ring-teal-100 transition-all text-sm bg-white cursor-pointer text-slate-800"
            {...register("hospitalNetwork")}
          >
            <option value="standard">Padrão (Rede Básica + Média)</option>
            <option value="premium">Premium (Rede Ampla + Hospitais de Referência)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <FiChevronDown />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id="coparticipation"
            {...register("coparticipation")}
            className="w-5 h-5 cursor-pointer accent-teal-600 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
        </div>
        <label htmlFor="coparticipation" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
          Plano com Coparticipação (mensalidade reduzida)
        </label>
      </div>

      <div className="flex gap-4 mt-6">
        <button type="button" className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 py-2.5 px-5 rounded-lg hover:bg-slate-50 cursor-pointer transition-all" onClick={onBack}>
          Voltar
        </button>
        <button type="submit" className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white py-2.5 px-5 rounded-lg hover:bg-slate-800 cursor-pointer transition-all shadow-md shadow-slate-200">
          Calcular Resultados
        </button>
      </div>
    </form>
  );
}
