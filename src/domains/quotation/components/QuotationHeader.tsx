import React from "react";

interface HeaderProps {
  clientName?: string;
  status?: string;
}

export function QuotationHeader({ clientName, status }: HeaderProps) {
  const displayStatus = status || "Rascunho";
  
  return (
    <header className="flex justify-between items-center border-b border-slate-200 pb-6 mb-8 w-full">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold uppercase tracking-widest">
          <span className="pulse-dot"></span>
          <span>{displayStatus}</span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">Painel do Corretor</h1>
          {clientName && (
            <p className="text-xs text-slate-500 mt-1">
              Cotação para: <strong className="font-semibold text-slate-800">{clientName}</strong>
            </p>
          )}
        </div>
      </div>
      <div>
        <span className="text-[10px] text-slate-400 font-mono">
          v1.0.0
        </span>
      </div>
    </header>
  );
}
