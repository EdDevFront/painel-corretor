import React from "react";
import { OperatorResult } from "../../../types";
import { FiPlus, FiActivity } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

interface AgeGroup {
  bracket: string;
  count: number;
  unitPrice: number;
  total: number;
}

interface QuotationPricingSidebarProps {
  selectedPlan: OperatorResult;
  ageGroups: AgeGroup[];
  comment: string;
  setComment: (c: string) => void;
  handleSaveComment: () => void;
  setIsHospitalsOpen: (open: boolean) => void;
}

export function QuotationPricingSidebar({
  selectedPlan,
  ageGroups,
  comment,
  setComment,
  handleSaveComment,
  setIsHospitalsOpen,
}: QuotationPricingSidebarProps) {
  const hasCommentText = comment.trim().length > 0;
  const whatsappLink = `https://wa.me/5500000000000?text=Tenho%20interesse%20no%20plano%20${selectedPlan.operatorName}`;

  return (
    <div className="flex-1 min-w-[280px] space-y-4 print:w-full print:order-1">
      <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs print:border-none print:shadow-none">
        <h3 className="font-bold text-slate-900 text-base mb-1">{selectedPlan.operatorName}</h3>

        <div className="mt-2 mb-4 no-print space-y-2">
          <input
            type="text"
            placeholder="Adicione um comentário..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-teal-500 bg-slate-50/50"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!hasCommentText}
              onClick={handleSaveComment}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-md transition-colors uppercase"
            >
              Salvar
            </button>
          </div>
        </div>

        {hasCommentText && (
          <div className="hidden print:block bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 text-xs text-slate-600">
            <strong>Observação:</strong> {comment}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {ageGroups.map((g) => (
            <div key={g.bracket} className="flex justify-between text-sm text-slate-600">
              <span>{g.bracket}</span>
              <strong className="font-semibold text-slate-900 whitespace-nowrap">
                {g.count} x R$ {g.unitPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </strong>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col gap-1 mb-5">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Mensalidade</span>
          <div className="text-3xl font-black text-slate-900 whitespace-nowrap flex items-baseline gap-1">
            <span className="text-sm font-normal text-slate-400">R$</span>
            <span>{selectedPlan.totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.open(whatsappLink)}
          className="w-full bg-[#25d366] text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-colors cursor-pointer shadow-xs no-print"
        >
          <FaWhatsapp className="text-lg" /> Tenho interesse
        </button>
      </div>

      <div
        onClick={() => setIsHospitalsOpen(true)}
        className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs flex justify-between items-center cursor-pointer hover:border-slate-200 transition-colors print:hidden"
      >
        <div>
          <h4 className="font-bold text-slate-900 text-sm">40 Hospitais</h4>
          <p className="text-xs text-slate-400 mt-0.5">Confira os principais hospitais da rede.</p>
        </div>
        <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
          <FiPlus />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs flex justify-between items-center print:hidden">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">6 Laboratórios</h4>
          <p className="text-xs text-slate-400 mt-0.5">Confira os laboratórios credenciados.</p>
        </div>
        <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
          <FiActivity />
        </div>
      </div>
    </div>
  );
}