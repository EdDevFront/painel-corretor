import React, { useState, useEffect } from "react";
import { Quotation, OperatorResult } from "../../types";
import { Button } from "../../../../components/ui/Button";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";
import { QuotationHospitalsModal } from "../QuotationResults/components/QuotationHospitalsModal";
import { QuotationPlanAccordions } from "./components/QuotationPlanAccordions";
import { QuotationPricingSidebar } from "./components/QuotationPricingSidebar";

const MOCK_HOSPITALS = [
  { region: "SÃƒÆ’Ã‚Â£o Paulo - Centro", items: [{ name: "Hospital BP", sub: "Bela Vista", type: "H, PS" }, { name: "Leforte", sub: "Liberdade", type: "H, PS" }] },
  { region: "SÃƒÆ’Ã‚Â£o Paulo - Zona Sul", items: [{ name: "Hospital Santa Joana", sub: "ParaÃƒÆ’Ã‚Â­so", type: "M, H" }] },
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

export function QuotationPlanDetail({ quotation, selectedPlan, ageGroups, onBack }: QuotationPlanDetailProps) {
  const [comment, setComment] = useState("");
  const [isHospitalsOpen, setIsHospitalsOpen] = useState(false);
  const [hospitalsSearch, setHospitalsSearch] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ copart: true });

  const storageKey = `comment_${quotation.id}_${selectedPlan.operatorId}`;

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    if (isBrowser) {
      const saved = localStorage.getItem(storageKey) || "";
      setComment(saved);
    }
  }, [selectedPlan, quotation.id, storageKey]);

  const handleSaveComment = () => {
    localStorage.setItem(storageKey, comment);
    alert("ComentÃƒÆ’Ã‚Â¡rio salvo com sucesso!");
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const pageTitle = quotation.title || "CotaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de Plano de SaÃƒÆ’Ã‚Âºde";
  const breadcrumbTitle = quotation.title || "Comparativo";

  return (
    <div className="w-full relative z-10 animate-fadeIn text-left">
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 no-print font-medium">
        <a href="/cotacoes" className="hover:text-slate-600 transition-colors">CotaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes</a>
        <span>/</span>
        <button onClick={onBack} className="hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer font-medium p-0">
          {breadcrumbTitle}
        </button>
        <span>/</span>
        <span className="text-slate-700 font-semibold">{selectedPlan.operatorName}</span>
      </nav>

      <div className="hidden print:block border-b border-slate-300 pb-4 mb-6">
        <h1 className="text-2xl font-black text-slate-900">{pageTitle}</h1>
      </div>

      <div className="flex justify-between items-center mb-6 no-print flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedPlan.operatorName}</h2>
          <p className="text-slate-500 text-sm mt-1">SaÃƒÆ’Ã‚Âºde {quotation.mode}</p>
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

      <div className="flex gap-6 items-start flex-wrap print:flex-col print:w-full print:gap-6">
        <QuotationPlanAccordions
          quotation={quotation}
          openAccordions={openAccordions}
          toggleAccordion={toggleAccordion}
        />

        <QuotationPricingSidebar
          selectedPlan={selectedPlan}
          ageGroups={ageGroups}
          comment={comment}
          setComment={setComment}
          handleSaveComment={handleSaveComment}
          setIsHospitalsOpen={setIsHospitalsOpen}
        />
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