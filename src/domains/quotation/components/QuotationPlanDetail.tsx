import React, { useState, useEffect } from "react";
import { Quotation, OperatorResult } from "../types";
import { Button } from "../../../components/ui/Button";
import {
  FiArrowLeft, FiPrinter, FiPlus, FiChevronDown, FiChevronUp, FiActivity,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { QuotationHospitalsModal } from "./QuotationHospitalsModal";

const MOCK_HOSPITALS = [
  {
    region: "São Paulo - Centro",
    items: [
      { name: "Hospital BP", sub: "Bela Vista", type: "H, PS" },
      { name: "Leforte", sub: "Liberdade", type: "H, PS" },
    ],
  },
  {
    region: "São Paulo - Zona Sul",
    items: [{ name: "Hospital Santa Joana", sub: "Paraíso", type: "M, H" }],
  },
];

const PLAN_ACCORDIONS = [
  { id: "area", title: "Área de Comercialização / Utilização", desc: "Disponível para toda a Região Metropolitana e capitais associadas." },
  { id: "cancel", title: "Cancelamento do Contrato", desc: "Cancelamento sem carência ou multas rescisórias em até 30 dias após a assinatura formal." },
  { id: "carencias", title: "Carências", desc: "Urgência e emergência: 24h. Consultas e exames simples: 30 dias. Procedimentos complexos: 180 dias. Parto: 300 dias." },
  { id: "composition", title: "Composição / Quem Pode Aderir", desc: "Sócios, administradores e funcionários com vínculo CLT ativo." },
  { id: "docs", title: "Documentos Necessários", desc: "RG, CPF, Comprovante de Residência e Contrato Social ou Certificado de MEI." },
  { id: "pay", title: "Forma de Pagamento", desc: "Boleto bancário mensal com vencimento selecionado na assinatura da proposta." },
  { id: "prod", title: "Produto", desc: "Plano corporativo regulamentado pela ANS nº 489.120/21-8." },
];

interface AgeGroup {
  bracket: string;
  count: number;
  unitPrice: number;
  total: number;
}

interface QuotationPlanDetailProps {
  quotation: Quotation;
  selectedPlan: OperatorResult;
  ageGroups: AgeGroup[];
  onBack: () => void;
}

export function QuotationPlanDetail({
  quotation,
  selectedPlan,
  ageGroups,
  onBack,
}: QuotationPlanDetailProps) {
  const [comment, setComment] = useState("");
  const [isHospitalsOpen, setIsHospitalsOpen] = useState(false);
  const [hospitalsSearch, setHospitalsSearch] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ copart: true });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`comment_${quotation.id}_${selectedPlan.operatorId}`) || "";
      setComment(saved);
    }
  }, [selectedPlan, quotation.id]);

  const handleSaveComment = () => {
    localStorage.setItem(`comment_${quotation.id}_${selectedPlan.operatorId}`, comment);
    alert("Comentário salvo com sucesso!");
  };

  const toggleAccordion = (key: string) =>
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="w-full relative z-10 animate-fadeIn text-left">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 no-print font-medium">
        <a href="/cotacoes" className="hover:text-slate-600 transition-colors">Cotações</a>
        <span>/</span>
        <button
          onClick={onBack}
          className="hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer font-medium p-0"
        >
          {quotation.title || "Comparativo"}
        </button>
        <span>/</span>
        <span className="text-slate-700 font-semibold">{selectedPlan.operatorName}</span>
      </nav>

      {/* Print-only header */}
      <div className="hidden print:block border-b border-slate-300 pb-4 mb-6">
        <h1 className="text-2xl font-black text-slate-900">{quotation.title || "Cotação de Plano de Saúde"}</h1>
      </div>

      {/* Actions bar */}
      <div className="flex justify-between items-center mb-6 no-print flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedPlan.operatorName}</h2>
          <p className="text-slate-500 text-sm mt-1">Saúde {quotation.mode}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            <FiPrinter className="mr-1.5" /> Imprimir Proposta
          </Button>
          <Button variant="secondary" onClick={onBack}>
            <FiArrowLeft className="mr-1.5" /> Voltar para Planos
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex gap-6 items-start flex-wrap print:flex-col print:w-full print:gap-6">
        {/* Left: Accordions */}
        <div className="flex-[3] min-w-[300px] space-y-3 print:w-full print:order-2">
          {/* Coparticipação accordion */}
          <div className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-xs print:border-none print:shadow-none">
            <button
              onClick={() => toggleAccordion("copart")}
              className="w-full p-4 flex justify-between items-center font-bold text-slate-800 hover:bg-slate-50 text-left text-sm no-print"
            >
              <span>{quotation.preferences.coparticipation ? "Com coparticipação" : "Sem coparticipação"}</span>
              {openAccordions.copart ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            <h4 className="hidden print:block font-bold text-slate-950 text-sm p-4 pb-1 uppercase tracking-wider">
              {quotation.preferences.coparticipation ? "Com coparticipação" : "Sem coparticipação"}
            </h4>
            <div className={`p-4 pt-0 border-t border-slate-50 text-sm text-slate-500 leading-relaxed ${openAccordions.copart ? "block" : "hidden"} print:block print:border-none print:pt-2`}>
              {quotation.preferences.coparticipation
                ? "Possui custos adicionais reduzidos para a realização de consultas, exames simples, e procedimentos médicos eletivos."
                : "Não possui custos adicionais para realização de consultas, exames, procedimentos ou internações corporativas."}
            </div>
          </div>

          {/* Other accordions */}
          {PLAN_ACCORDIONS.map((acc) => (
            <div key={acc.id} className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-xs print:border-none print:shadow-none">
              <button
                onClick={() => toggleAccordion(acc.id)}
                className="w-full p-4 flex justify-between items-center font-bold text-slate-800 hover:bg-slate-50 text-left text-sm no-print"
              >
                <span>{acc.title}</span>
                {openAccordions[acc.id] ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              <h4 className="hidden print:block font-bold text-slate-950 text-sm p-4 pb-1 uppercase tracking-wider">
                {acc.title}
              </h4>
              <div className={`p-4 pt-0 border-t border-slate-50 text-sm text-slate-500 leading-relaxed ${openAccordions[acc.id] ? "block" : "hidden"} print:block print:border-none print:pt-2`}>
                {acc.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Pricing sidebar */}
        <div className="flex-1 min-w-[280px] space-y-4 print:w-full print:order-1">
          <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs print:border-none print:shadow-none">
            <h3 className="font-bold text-slate-900 text-base mb-1">{selectedPlan.operatorName}</h3>

            {/* Comment */}
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
                  disabled={!comment.trim()}
                  onClick={handleSaveComment}
                  className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-md transition-colors uppercase"
                >
                  Salvar
                </button>
              </div>
            </div>

            {comment && (
              <div className="hidden print:block bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 text-xs text-slate-600">
                <strong>Observação:</strong> {comment}
              </div>
            )}

            {/* Age groups breakdown */}
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

            {/* Total */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-1 mb-5">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Mensalidade</span>
              <div className="text-3xl font-black text-slate-900 whitespace-nowrap flex items-baseline gap-1">
                <span className="text-sm font-normal text-slate-400">R$</span>
                <span>{selectedPlan.totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.open(`https://wa.me/5500000000000?text=Tenho%20interesse%20no%20plano%20${selectedPlan.operatorName}`)}
              className="w-full bg-[#25d366] text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-colors cursor-pointer shadow-xs no-print"
            >
              <FaWhatsapp className="text-lg" /> Tenho interesse
            </button>
          </div>

          {/* Hospital coverage cards */}
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
      </div>

      <QuotationHospitalsModal
        isOpen={isHospitalsOpen}
        onClose={() => setIsHospitalsOpen(false)}
        planName={selectedPlan.operatorName}
        groups={MOCK_HOSPITALS}
        search={hospitalsSearch}
        onSearchChange={setHospitalsSearch}
      />
    </div>
  );
}
