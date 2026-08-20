import React from "react";
import { Quotation } from "../../../types";

interface QuotationResultsSidebarProps {
  quotation: Quotation;
  totalLives: number;
}

export function QuotationResultsSidebar({ quotation, totalLives }: QuotationResultsSidebarProps) {
  const isPME = quotation.mode === "PME";
  const hasMultipleLives = totalLives > 1;

  return (
    <div className="flex-1 min-w-[280px] bg-slate-50 border border-slate-200/60 rounded-xl p-6 shadow-xs space-y-4 print:w-full print:border-none print:shadow-none print:p-0">
      <div>
        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Distribuição</span>
        <div className="text-lg font-bold text-slate-800 mt-1">Geral</div>
        <div className="text-sm text-slate-500 mt-0.5">
          {totalLives} {hasMultipleLives ? "vidas" : "vida"} cadastrada(s)
        </div>
      </div>
      
      <div className="border-t border-slate-200/60 pt-4 print:border-none">
        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">CNPJ / CPF</span>
        <div className="text-base font-semibold text-slate-800 mt-1">
          {isPME ? "Informado (PME)" : "Não informado"}
        </div>
      </div>
      
      <div className="border-t border-slate-200/60 pt-4 flex items-center gap-2.5 text-sm text-slate-500 print:hidden">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <div>
          <span>Criada por <strong className="font-semibold text-slate-700">{quotation.brokerName}</strong></span>
          <p className="text-[10px] text-slate-400 mt-0.5">há alguns instantes</p>
        </div>
      </div>
    </div>
  );
}