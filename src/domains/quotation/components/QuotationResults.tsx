import React from "react";
import { Quotation, OperatorResult } from "../types";

interface ResultsProps {
  quotation: Quotation;
  onRestart: () => void;
  onBack: () => void;
}

export function QuotationResults({ quotation, onRestart, onBack }: ResultsProps) {
  const results = quotation.results;
  const preferredOp = quotation.preferences.operatorId;

  if (!results) {
    return <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs">Nenhum resultado de cálculo disponível.</div>;
  }

  const displayedResults = preferredOp
    ? results.operatorResults.filter((r) => r.operatorId === preferredOp)
    : [...results.operatorResults].sort((a, b) => a.totalPrice - b.totalPrice);

  return (
    <div className="max-w-[800px] mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Resultados da Cotação</h2>
        <button className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 py-2.5 px-5 rounded-lg hover:bg-slate-50 cursor-pointer transition-all" onClick={onRestart}>Nova Cotação</button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {displayedResults.map((opResult: OperatorResult) => (
          <div key={opResult.operatorId} className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs flex justify-between items-center flex-wrap gap-6 hover:border-slate-200 hover:shadow-sm transition-all duration-300">
            <div>
              <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[9px] font-bold uppercase tracking-widest mb-2">Operadora</span>
              <h3 className="text-xl font-bold text-slate-900">{opResult.operatorName}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Total para {results.totalLives} {results.totalLives === 1 ? "vida" : "vidas"}
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Valor Mensal</span>
              <div className="text-3xl font-extrabold text-teal-600">
                R$ {opResult.totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-400">
                + R$ {results.baseFees.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} taxa adm.
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-100 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Resumo Técnico da Cotação</h4>
        <div className="flex justify-between mb-2 text-sm text-slate-700">
          <span>Cliente:</span>
          <strong className="font-semibold text-slate-900">{quotation.clientName}</strong>
        </div>
        <div className="flex justify-between mb-2 text-sm text-slate-700">
          <span>Corretor:</span>
          <strong className="font-semibold text-slate-900">{quotation.brokerName}</strong>
        </div>
        <div className="flex justify-between mb-2 text-sm text-slate-700">
          <span>Modalidade:</span>
          <strong className="font-semibold text-slate-900">{quotation.mode === "PF" ? "Pessoa Física (PF)" : quotation.mode === "PME" ? "Pequena e Média Empresa (PME)" : "Adesão"}</strong>
        </div>
        <div className="flex justify-between text-sm text-slate-700">
          <span>Coparticipação:</span>
          <strong className="font-semibold text-slate-900">{quotation.preferences.coparticipation ? "Sim" : "Não"}</strong>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="button" className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 py-2.5 px-5 rounded-lg hover:bg-slate-50 cursor-pointer transition-all" onClick={onBack}>
          Voltar e Editar
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white py-2.5 px-5 rounded-lg hover:bg-slate-800 cursor-pointer transition-all shadow-md shadow-slate-200" onClick={() => window.print()}>
          Imprimir / PDF
        </button>
      </div>
    </div>
  );
}
