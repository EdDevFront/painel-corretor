import React from "react";
import { Quotation } from "../../../types";

interface QuotationSuccessScreenProps {
  quotation: Quotation;
  onGoToList: () => void;
  onViewQuotation: () => void;
}

export function QuotationSuccessScreen({
  quotation,
  onGoToList,
  onViewQuotation,
}: QuotationSuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
      <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">CotaÃƒÂ§ÃƒÂ£o criada com sucesso!</h2>
      <p className="text-slate-400 text-sm max-w-[400px] mb-2">
        A cotaÃƒÂ§ÃƒÂ£o <strong className="text-slate-700">{quotation.title}</strong> foi gerada para{" "}
        <strong className="text-slate-700">{quotation.clientName}</strong>.
      </p>
      <p className="text-slate-400 text-xs mb-8">
        {quotation.lives?.length ?? 0} vidas incluÃƒÂ­das Ã¢â‚¬Â¢ Gerada em{" "}
        {new Date(quotation.createdAt).toLocaleDateString("pt-BR")}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onGoToList}
          className="px-5 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white"
        >
          Ir para CotaÃƒÂ§ÃƒÂµes
        </button>
        <button
          onClick={onViewQuotation}
          className="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Ver cotaÃƒÂ§ÃƒÂ£o Ã¢â€ â€™
        </button>
      </div>
    </div>
  );
}
