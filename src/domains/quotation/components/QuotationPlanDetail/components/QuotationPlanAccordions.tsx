import React from "react";
import { Quotation } from "../../../types";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const PLAN_ACCORDIONS = [
  { id: "area", title: "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Ârea de ComercializaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o / UtilizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o", desc: "DisponÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­vel para toda a RegiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Metropolitana e capitais associadas." },
  { id: "cancel", title: "Cancelamento do Contrato", desc: "Cancelamento sem carÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia ou multas rescisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rias em atÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© 30 dias apÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³s a assinatura formal." },
  { id: "carencias", title: "CarÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias", desc: "UrgÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia e emergÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia: 24h. Consultas e exames simples: 30 dias. Procedimentos complexos: 180 dias. Parto: 300 dias." },
  { id: "composition", title: "ComposiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o / Quem Pode Aderir", desc: "SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cios, administradores e funcionÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios com vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nculo CLT ativo." },
  { id: "docs", title: "Documentos NecessÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios", desc: "RG, CPF, Comprovante de ResidÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia e Contrato Social ou Certificado de MEI." },
  { id: "pay", title: "Forma de Pagamento", desc: "Boleto bancÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio mensal com vencimento selecionado na assinatura da proposta." },
  { id: "prod", title: "Produto", desc: "Plano corporativo regulamentado pela ANS nÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âº 489.120/21-8." },
];

interface QuotationPlanAccordionsProps {
  quotation: Quotation;
  openAccordions: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
}

export function QuotationPlanAccordions({ quotation, openAccordions, toggleAccordion }: QuotationPlanAccordionsProps) {
  const hasCoparticipation = quotation.preferences.coparticipation;
  const copartTitle = hasCoparticipation ? "Com coparticipaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o" : "Sem coparticipaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o";
  const copartDesc = hasCoparticipation
    ? "Possui custos adicionais reduzidos para a realizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de consultas, exames simples, e procedimentos mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©dicos eletivos."
    : "NÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o possui custos adicionais para realizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de consultas, exames, procedimentos ou internaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes corporativas.";
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