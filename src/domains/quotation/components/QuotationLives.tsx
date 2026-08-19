import React from "react";
import { useForm } from "react-hook-form";
import { Life } from "../types";
import { calculateAge } from "../calculator";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

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
    <div className="bg-white border border-slate-100 rounded-lg p-6 md:p-8 shadow-xs max-w-[800px] mx-auto w-full">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Gerenciamento de Vidas</h2>
      
      <form onSubmit={handleSubmit(onAddLife)} className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-1 mb-8 items-end">
        <div className="md:col-span-2">
          <Input
            label="Nome"
            placeholder="Nome da pessoa"
            error={errors.name?.message}
            {...register("name", { required: "Nome é obrigatório", minLength: { value: 3, message: "Mínimo 3 letras" } })}
          />
        </div>
        <div>
          <Input
            label="Nascimento"
            type="date"
            error={errors.birthDate?.message}
            {...register("birthDate", { required: "Obrigatório" })}
          />
        </div>
        <Button type="submit" className="h-[40px] mb-5 md:mb-0">
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
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleRemoveLife(life.id)}
                      className="border-none bg-transparent hover:bg-red-50 text-slate-400 hover:text-red-600 !py-1 !px-2.5 normal-case"
                    >
                      Remover
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={onBack}>
          Voltar
        </Button>
        <Button
          type="button"
          size="lg"
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
