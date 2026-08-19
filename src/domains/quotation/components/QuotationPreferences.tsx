import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { QuotationPreferences as Prefs } from "../types";
import { Operator } from "../../operator/types";
import { getOperators } from "../../operator/service";
import { Select } from "../../shared/components/ui/Select";
import { Button } from "../../shared/components/ui/Button";

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

      <div className="mb-5">
        <Select label="Filtrar Operadora Preferencial" {...register("operatorId")}>
          <option value="">Todas as Operadoras (Comparativo)</option>
          {operators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mb-5">
        <Select label="Rede Hospitalar" {...register("hospitalNetwork")}>
          <option value="standard">Padrão (Rede Básica + Média)</option>
          <option value="premium">Premium (Rede Ampla + Hospitais de Referência)</option>
        </Select>
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
        <Button type="button" variant="secondary" className="flex-1" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" className="flex-1">
          Calcular Resultados
        </Button>
      </div>
    </form>
  );
}
