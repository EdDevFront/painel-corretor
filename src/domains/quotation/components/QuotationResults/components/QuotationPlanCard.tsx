import React from "react";
import { OperatorResult } from "../../../types";
import { Quotation } from "../../../types";
import { Button } from "../../../../../components/ui/Button";

interface QuotationPlanCardProps {
  opResult: OperatorResult;
  quotation: Quotation;
  onSelect: (op: OperatorResult) => void;
}

export function QuotationPlanCard({ opResult, quotation, onSelect }: QuotationPlanCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 md:p-7 shadow-xs flex flex-col justify-between hover:border-slate-200 hover:shadow-sm transition-all duration-200 print:shadow-none print:border-none print:p-0 print:mb-6 text-left">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="h-10 w-10 shrink-0 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center font-extrabold text-sm border border-amber-500/20 shadow-xs">
            {opResult.operatorName.substring(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="space-y-1 mb-5 text-left">
          <h3 className="font-bold text-slate-950 text-base">{opResult.operatorName}</h3>
          <p className="text-xs text-slate-500">
            {"Saude "}{quotation.mode}{" "}
            {quotation.preferences.hospitalNetwork === "premium" ? "Rede Premium" : "Rede Basica"}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-slate-400">
            <span className="bg-slate-50 px-2 py-0.5 rounded-sm">40 Hospitais</span>
            <span className="bg-slate-50 px-2 py-0.5 rounded-sm">
              {quotation.preferences.coparticipation ? "Copart" : "Sem copart"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50">
        <div className="mb-4">
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
            Mensalidade
          </span>
          <div className="text-3xl font-black text-slate-900 whitespace-nowrap flex items-baseline justify-start gap-1">
            <span className="text-sm font-normal text-slate-400">R$</span>
            <span>
              {opResult.totalPrice.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-[10px] font-normal text-slate-400">/mes</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full text-sm py-2.5 normal-case font-bold no-print"
          onClick={() => onSelect(opResult)}
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  );
}