import React, { useState } from "react";
import { Quotation, OperatorResult } from "../../types";
import { Button } from "../../../../components/ui/Button";
import { IconButton } from "../../../../components/ui/IconButton";
import {
  FiPrinter, FiSend, FiMoreVertical, FiShare2, FiSliders,
  FiCopy, FiTrash2,
} from "react-icons/fi";
import { QuotationPlanCard } from "./components/QuotationPlanCard";
import { QuotationPlanDetail } from "../QuotationPlanDetail/QuotationPlanDetail";
import { QuotationShareModal } from "./components/QuotationShareModal";
import { QuotationHospitalsModal } from "./components/QuotationHospitalsModal";
import { QuotationResultsSidebar } from "./components/QuotationResultsSidebar";

const MOCK_HOSPITALS = [
  { region: "São Paulo - Centro", items: [{ name: "Hospital BP", sub: "Bela Vista", type: "H, PS" }, { name: "Leforte", sub: "Liberdade", type: "H, PS" }] },
  { region: "São Paulo - Zona Sul", items: [{ name: "Hospital Santa Joana", sub: "Paraíso", type: "M, H" }] },
];

interface ResultsProps {
  quotation: Quotation;
  onRestart: () => void;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDetailView?: boolean;
  selectedPlanName?: string | null;
  onSelectPlanName?: (planName: string | null) => void;
}

export function QuotationResults({
  quotation,
  onDelete,
  selectedPlanName,
  onSelectPlanName,
}: ResultsProps) {
  const [localSelectedPlan, setLocalSelectedPlan] = useState<OperatorResult | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isHospitalsOpen, setIsHospitalsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hospitalsSearch, setHospitalsSearch] = useState("");

  const results = quotation.results;
  const hasNoResults = !results;

  if (hasNoResults) {
    return (
      <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs text-sm">
        Nenhum resultado de cálculo disponível.
      </div>
    );
  }

  const preferredOp = quotation.preferences.operatorId;
  const hasPreferredOperator = !!preferredOp;
  const displayedResults = hasPreferredOperator
    ? results.operatorResults.filter((r) => r.operatorId === preferredOp)
    : [...results.operatorResults].sort((a, b) => a.totalPrice - b.totalPrice);

  const isLiftedSelection = selectedPlanName !== undefined;
  const selectedPlan = isLiftedSelection
    ? results.operatorResults.find((r) => r.operatorName === selectedPlanName) || null
    : localSelectedPlan;

  const setSelectedPlan = (plan: OperatorResult | null) => {
    if (onSelectPlanName) {
      onSelectPlanName(plan ? plan.operatorName : null);
    } else {
      setLocalSelectedPlan(plan);
    }
  };

  const getAgeBracket = (age: number) => {
    if (age <= 18) return "0 a 18 anos";
    if (age <= 23) return "19 a 23 anos";
    if (age <= 28) return "24 a 28 anos";
    if (age <= 33) return "29 a 33 anos";
    if (age <= 38) return "34 a 38 anos";
    if (age <= 43) return "39 a 43 anos";
    if (age <= 48) return "44 a 48 anos";
    if (age <= 53) return "49 a 53 anos";
    if (age <= 58) return "54 a 58 anos";
    return "59 anos ou mais";
  };

  const getAgeGroups = (plan: OperatorResult) => {
    const groups: Record<string, { count: number; unitPrice: number; total: number }> = {};
    quotation.lives.forEach((life) => {
      const bracket = getAgeBracket(life.age);
      const priceDetail = plan.livesPrices.find((lp) => lp.lifeId === life.id);
      const price = priceDetail ? priceDetail.price : 0;
      if (!groups[bracket]) groups[bracket] = { count: 0, unitPrice: price, total: 0 };
      groups[bracket].count += 1;
      groups[bracket].total += price;
    });
    return Object.entries(groups).map(([bracket, info]) => ({
      bracket,
      count: info.count,
      unitPrice: info.unitPrice,
      total: info.total,
    }));
  };

  const isPlanSelected = !!selectedPlan;
  if (isPlanSelected) {
    return (
      <QuotationPlanDetail
        quotation={quotation}
        selectedPlan={selectedPlan}
        ageGroups={getAgeGroups(selectedPlan)}
        onBack={() => setSelectedPlan(null)}
      />
    );
  }

  const creationDate = new Date(quotation.createdAt).toLocaleDateString("pt-BR");
  const defaultTitle = "Cotação de Plano de Saúde";
  const title = quotation.title || defaultTitle;
  const defaultPlanName = displayedResults[0]?.operatorName ?? "";

  return (
    <div className="w-full relative z-10 animate-fadeIn text-left">
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 no-print font-medium">
        <a href="/cotacoes" className="hover:text-slate-600 transition-colors">Cotações</a>
        <span>/</span>
        <span className="text-slate-700 font-semibold">{title}</span>
      </nav>

      <div className="hidden print:block border-b border-slate-300 pb-4 mb-6 text-left">
        <h1 className="text-2xl font-black text-slate-900">{title}</h1>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 mt-3 text-sm text-slate-700">
          <div><strong>Cliente:</strong> {quotation.clientName}</div>
          <div><strong>Corretor:</strong> {quotation.brokerName}</div>
          <div><strong>Modalidade:</strong> {quotation.mode}</div>
          <div><strong>Data de Emissão:</strong> {creationDate}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 no-print flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Comparativo de planos de saúde</h2>
          <p className="text-slate-400 text-sm mt-1">Gerado em {creationDate} • {quotation.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => window.print()}><FiPrinter className="mr-1" /> Imprimir Comparativo</Button>
          <Button variant="secondary" onClick={() => setIsHospitalsOpen(true)}>Ver hospitais</Button>
          <Button onClick={() => setIsShareOpen(true)} className="flex items-center gap-1.5"><FiSend /> Enviar</Button>

          <div className="relative">
            <IconButton type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`border-slate-200 transition-colors ${isMenuOpen ? "bg-slate-50 border-slate-300" : ""}`} title="Mais Opções">
              <FiMoreVertical />
            </IconButton>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-[180px] bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1.5 animate-fadeIn">
                  <button onClick={() => { setIsMenuOpen(false); setIsShareOpen(true); }} className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                    <FiShare2 className="text-sm text-slate-400" /> Compartilhar
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); window.print(); }} className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                    <FiPrinter className="text-sm text-slate-400" /> Imprimir
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); alert("Filtros do cotador ativados."); }} className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                    <FiSliders className="text-sm text-slate-400" /> Opções
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button onClick={() => { setIsMenuOpen(false); alert("Cotação duplicada com sucesso!"); }} className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                    <FiCopy className="text-sm text-slate-400" /> Duplicar
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); if (onDelete) onDelete(); }} className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                    <FiTrash2 className="text-sm text-red-500" /> Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-start flex-wrap print:flex-col print:w-full print:gap-6">
        <div className="flex-[3] min-w-[300px] grid grid-cols-1 md:grid-cols-2 gap-5 print:w-full print:grid-cols-1">
          {displayedResults.map((opResult) => (
            <QuotationPlanCard key={opResult.operatorId} opResult={opResult} quotation={quotation} onSelect={setSelectedPlan} />
          ))}
        </div>
        <QuotationResultsSidebar quotation={quotation} totalLives={results.totalLives} />
      </div>

      <QuotationShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} quotationId={quotation.id} />
      <QuotationHospitalsModal isOpen={isHospitalsOpen} onClose={() => setIsHospitalsOpen(false)} planName={defaultPlanName} groups={MOCK_HOSPITALS} search={hospitalsSearch} onSearchChange={setHospitalsSearch} />
    </div>
  );
}