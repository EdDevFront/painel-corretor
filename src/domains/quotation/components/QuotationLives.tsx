import React from "react";
import { useForm } from "react-hook-form";
import { Life } from "../types";
import { calculateAge } from "../calculator";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";

interface LivesProps {
  lives: Life[];
  onUpdateLives: (lives: Life[]) => void;
  onBack: () => void;
  onNext: () => void;
}

interface LifeFormInput {
  name: string;
  birthDate: string;
}

export function QuotationLives({ lives, onUpdateLives, onBack, onNext }: LivesProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LifeFormInput>();

  const onAddLife = (data: LifeFormInput) => {
    const newLife: Life = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      birthDate: data.birthDate,
      age: calculateAge(data.birthDate),
      price: 0,
    };
    onUpdateLives([...lives, newLife]);
    reset();
  };

  const handleRemoveLife = (id: string) => {
    onUpdateLives(lives.filter((life) => life.id !== id));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs max-w-[600px] mx-auto">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Gerenciamento de Vidas</h2>
      
      <form onSubmit={handleSubmit(onAddLife)} className="flex gap-4 mb-8 items-end flex-wrap">
        <div className="flex-2 min-w-[150px]">
          <Input
            label="Nome"
            placeholder="Nome da pessoa"
            error={errors.name?.message}
            {...register("name", { required: "Nome é obrigatório", minLength: { value: 3, message: "Mínimo 3 letras" } })}
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <Input
            label="Nascimento"
            type="date"
            error={errors.birthDate?.message}
            {...register("birthDate", { required: "Obrigatório" })}
          />
        </div>
        <Button type="submit" className="h-[40px]">
          Adicionar
        </Button>
      </form>

      {lives.length === 0 ? (
        <p className="text-slate-400 text-center my-8">
          Nenhuma vida cadastrada nesta cotação.
        </p>
      ) : (
        <div className="overflow-x-auto mb-8 border border-slate-100 rounded-lg">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Nome</th>
                <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Nascimento</th>
                <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Idade</th>
                <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lives.map((life) => (
                <tr key={life.id} className="border-b border-slate-100 text-slate-700">
                  <td className="p-3 font-medium text-slate-900">{life.name}</td>
                  <td className="p-3 text-slate-500">
                    {new Date(life.birthDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">{life.age} anos</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveLife(life.id)}
                      className="background-none border-none text-slate-400 hover:text-red-500 cursor-pointer text-xs"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <Button type="button" variant="secondary" className="flex-1" onClick={onBack}>
          Voltar
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={onNext}
          disabled={lives.length === 0}
        >
          Prosseguir
        </Button>
      </div>
    </div>
  );
}
