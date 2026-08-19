import React from "react";
import { Quotation, OperatorResult } from "../types";
import { Button } from "../../../components/ui/Button";
import { FiCheckCircle, FiPrinter, FiArrowLeft, FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

interface ResultsProps {
  quotation: Quotation;
  onRestart: () => void;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function QuotationResults({ quotation, onRestart, onBack, onEdit, onDelete }: ResultsProps) {
  const results = quotation.results;
  const preferredOp = quotation.preferences.operatorId;

  if (!results) {
    return (
      <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs">
        Nenhum resultado de cálculo disponível.
      </div>
    );
  }

  const displayedResults = preferredOp
    ? results.operatorResults.filter((r) => r.operatorId === preferredOp)
    : [...results.operatorResults].sort((a, b) => a.totalPrice - b.totalPrice);

  return (
    <div className="max-w-[800px] mx-auto w-full">
      {/* 1. Success Alert Banner */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5 mb-6 flex items-center gap-4 text-emerald-800 no-print">
        <FiCheckCircle className="text-emerald-500 text-3xl shrink-0" />
        <div>
          <h3 className="font-bold text-sm">Cotação Salva com Sucesso!</h3>
          <p className="text-xs text-emerald-600/90 mt-0.5">Os dados foram arquivados e estão disponíveis na listagem de cotações.</p>
        </div>
      </div>

      {/* 2. Step navigation at the top */}
      <div className="flex gap-4 mb-8 flex-wrap no-print">
        <Button type="button" variant="secondary" className="flex-1 min-w-[100px]" onClick={onBack}>
          <FiArrowLeft className="mr-1.5" /> Voltar
        </Button>
        <Button type="button" variant="secondary" className="flex-1 min-w-[150px]" onClick={onEdit}>
          <FiEdit className="mr-1.5" /> Editar Cotação
        </Button>
        <Button type="button" variant="secondary" className="flex-1 min-w-[150px] border-red-100 hover:bg-red-50 hover:text-red-600 text-slate-500" onClick={onDelete}>
          <FiTrash2 className="mr-1.5" /> Excluir
        </Button>
      </div>

      {/* Printable Area Target */}
      <div id="print-target" className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Resultados da Cotação</h2>
          <p className="text-slate-400 text-xs mt-1">Cotação gerada em {new Date(quotation.createdAt).toLocaleDateString("pt-BR")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {displayedResults.map((opResult: OperatorResult) => (
            <div key={opResult.operatorId} className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs flex justify-between items-center flex-wrap gap-6">
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

        <div className="bg-slate-50 border border-slate-100 rounded-lg p-6">
          <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Resumo Técnico</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between border-b border-slate-100 pb-2 text-sm text-slate-700">
              <span>Cliente:</span>
              <strong className="font-semibold text-slate-900">{quotation.clientName}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 text-sm text-slate-700">
              <span>Corretor:</span>
              <strong className="font-semibold text-slate-900">{quotation.brokerName}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 text-sm text-slate-700">
              <span>Modalidade:</span>
              <strong className="font-semibold text-slate-900">{quotation.mode === "PF" ? "Pessoa Física (PF)" : quotation.mode === "PME" ? "Pequena e Média Empresa (PME)" : "Adesão"}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 text-sm text-slate-700">
              <span>Coparticipação:</span>
              <strong className="font-semibold text-slate-900">{quotation.preferences.coparticipation ? "Sim" : "Não"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Printing and New actions at the bottom */}
      <div className="flex gap-4 mt-8 no-print">
        <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => window.print()}>
          <FiPrinter className="mr-1.5" /> Imprimir / PDF
        </Button>
        <Button type="button" variant="primary" size="lg" className="flex-1" onClick={onRestart}>
          <FiPlus className="mr-1.5" /> Nova Cotação
        </Button>
      </div>
    </div>
  );
}
