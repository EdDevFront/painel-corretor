import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { QuotationPreferences as Prefs } from "../types";
import { Operator } from "../../operator/types";
import { getOperators } from "../../operator/service";
import { Select } from "../../shared/components/ui/Select";
import { Button } from "../../shared/components/ui/Button";
import { Checkbox } from "../../shared/components/ui/Checkbox";

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
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border border-slate-100 rounded-lg p-6 md:p-8 shadow-xs max-w-[800px] mx-auto w-full">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Preferências e Filtros</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mb-4">
        <div>
          <Select label="Filtrar Operadora Preferencial" {...register("operatorId")}>
            <option value="">Todas as Operadoras (Comparativo)</option>
            {operators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Select label="Rede Hospitalar" {...register("hospitalNetwork")}>
            <option value="standard">Padrão (Rede Básica + Média)</option>
            <option value="premium">Premium (Rede Ampla + Hospitais de Referência)</option>
          </Select>
        </div>
      </div>

      <div className="my-6">
        <Checkbox
          id="coparticipation"
          label="Plano com Coparticipação (mensalidade reduzida)"
          {...register("coparticipation")}
        />
      </div>

      <div className="flex gap-4 mt-6">
        <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" size="lg" className="flex-1">
          Calcular Resultados
        </Button>
      </div>
    </form>
  );
}
