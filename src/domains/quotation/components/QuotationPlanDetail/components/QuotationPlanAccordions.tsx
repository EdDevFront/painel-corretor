import React from "react";
import { Quotation } from "../../../types";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const PLAN_ACCORDIONS = [
  { id: "area", title: "Área de Comercialização / Utilização", desc: "Disponível para toda a Região Metropolitana e capitais associadas." },
  { id: "cancel", title: "Cancelamento do Contrato", desc: "Cancelamento sem carência ou multas rescisórias em até 30 dias após a assinatura formal." },
  { id: "carencias", title: "Carências", desc: "Urgência e emergência: 24h. Consultas e exames simples: 30 dias. Procedimentos complexos: 180 dias. Parto: 300 dias." },
  { id: "composition", title: "Composição / Quem Pode Aderir", desc: "Sócios, administradores e funcionários com vínculo CLT ativo." },
  { id: "docs", title: "Documentos Necessários", desc: "RG, CPF, Comprovante de Residência e Contrato Social ou Certificado de MEI." },
  { id: "pay", title: "Forma de Pagamento", desc: "Boleto bancário mensal com vencimento selecionado na assinatura da proposta." },
  { id: "prod", title: "Produto", desc: "Plano corporativo regulamentado pela ANS nº 489.120/21-8." },
];

interface QuotationPlanAccordionsProps {
  quotation: Quotation;
  openAccordions: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
}

export function QuotationPlanAccordions({ quotation, openAccordions, toggleAccordion }: QuotationPlanAccordionsProps) {
  const hasCoparticipation = quotation.preferences.coparticipation;
  const copartTitle = hasCoparticipation ? "Com coparticipação" : "Sem coparticipação";
  const copartDesc = hasCoparticipation
    ? "Possui custos adicionais reduzidos para a realização de consultas, exames simples, e procedimentos médicos eletivos."
    : "Não possui custos adicionais para realização de consultas, exames, procedimentos ou internações corporativas.";
  const isCopartOpen = openAccordions.copart;

  return (
    <div className="flex-[3] min-w-[300px] space-y-3 print:w-full print:order-2">
      <div className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-xs print:border-none print:shadow-none">
        <button
          onClick={() => toggleAccordion("copart")}
          className="w-full p-4 flex justify-between items-center font-bold text-slate-800 hover:bg-slate-50 text-left text-sm no-print"
        >
          <span>{copartTitle}</span>
          {isCopartOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <h4 className="hidden print:block font-bold text-slate-950 text-sm p-4 pb-1 uppercase tracking-wider">
          {copartTitle}
        </h4>
        <div className={`p-4 pt-0 border-t border-slate-50 text-sm text-slate-500 leading-relaxed ${isCopartOpen ? "block" : "hidden"} print:block print:border-none print:pt-2`}>
          {copartDesc}
        </div>
      </div>

      {PLAN_ACCORDIONS.map((acc) => {
        const isOpen = openAccordions[acc.id];
        return (
          <div key={acc.id} className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-xs print:border-none print:shadow-none">
            <button
              onClick={() => toggleAccordion(acc.id)}
              className="w-full p-4 flex justify-between items-center font-bold text-slate-800 hover:bg-slate-50 text-left text-sm no-print"
            >
              <span>{acc.title}</span>
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            <h4 className="hidden print:block font-bold text-slate-950 text-sm p-4 pb-1 uppercase tracking-wider">
              {acc.title}
            </h4>
            <div className={`p-4 pt-0 border-t border-slate-50 text-sm text-slate-500 leading-relaxed ${isOpen ? "block" : "hidden"} print:block print:border-none print:pt-2`}>
              {acc.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
}