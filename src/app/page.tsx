"use client";

import React, { useState, useEffect } from "react";
import { useQuotation } from "../domains/quotation/hooks/useQuotation";
import { Quotation } from "../domains/quotation/types";
import { getQuotations, deleteQuotation } from "../domains/quotation/service";
import { Sidebar } from "../domains/shared/components/Sidebar";
import { Navbar } from "../domains/shared/components/Navbar";
import { QuotationList } from "../domains/quotation/components/QuotationList";
import { QuotationHeader } from "../domains/quotation/components/QuotationHeader";
import { QuotationStepper } from "../domains/quotation/components/QuotationStepper";
import { QuotationIdentification } from "../domains/quotation/components/QuotationIdentification";
import { QuotationProfile } from "../domains/quotation/components/QuotationProfile";
import { QuotationLives } from "../domains/quotation/components/QuotationLives";
import { QuotationPreferences } from "../domains/quotation/components/QuotationPreferences";
import { QuotationResults } from "../domains/quotation/components/QuotationResults";

export default function Home() {
  const [activeTab, setActiveTab] = useState("cotações");
  const [viewState, setViewState] = useState<"list" | "wizard">("list");
  const [allQuotations, setAllQuotations] = useState<Quotation[]>([]);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  
  const {
    quotation,
    currentStep,
    startNewQuotation,
    updateLives,
    updatePreferences,
    finalizeQuotation,
    prevStep,
    nextStep,
    setCurrentStep,
    loadQuotation,
  } = useQuotation();

  const fetchList = () => {
    setIsListLoading(true);
    getQuotations()
      .then(setAllQuotations)
      .finally(() => setIsListLoading(false));
  };

  useEffect(() => {
    if (viewState === "list") {
      fetchList();
    }
  }, [viewState]);

  const handleDelete = async (id: string) => {
    setIsListLoading(true);
    await deleteQuotation(id);
    fetchList();
  };

  const handleSelectQuotation = (id: string) => {
    loadQuotation(id);
    setViewState("wizard");
    setCurrentStep(3); // Start completed at step 3 or edit draft
  };

  const handleNewQuotation = () => {
    setViewState("wizard");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    setViewState("list");
  };

  return (
    <div className="flex flex-row min-h-screen w-full">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex flex-col flex-1 bg-slate-50">
        <Navbar />
        
        <main className="p-10 flex-1 overflow-y-auto relative">
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="glow-blue"></div>
            <div className="glow-teal"></div>
          </div>

          {activeTab === "cotações" && viewState === "list" && (
            <QuotationList
              quotations={allQuotations}
              isLoading={isListLoading}
              onSelectQuotation={handleSelectQuotation}
              onNewQuotation={handleNewQuotation}
              onDeleteQuotation={handleDelete}
            />
          )}

          {activeTab === "cotações" && viewState === "wizard" && (
            <div className="max-w-[800px] mx-auto w-full relative z-10">
              <QuotationHeader clientName={quotation?.clientName} status={quotation?.status} />
              <QuotationStepper currentStep={currentStep} />

              {currentStep === 1 && (
                <QuotationIdentification
                  initialClient={quotation?.clientName}
                  initialBroker={quotation?.brokerName}
                  initialMode={quotation?.mode}
                  onSubmit={startNewQuotation}
                />
              )}

              {currentStep === 2 && (
                <QuotationProfile
                  onBack={() => setViewState("list")}
                  onSubmit={() => nextStep()}
                />
              )}

              {currentStep === 3 && quotation && (
                <QuotationLives
                  lives={quotation.lives}
                  onUpdateLives={updateLives}
                  onBack={prevStep}
                  onNext={nextStep}
                />
              )}

              {currentStep === 4 && quotation && (
                <QuotationPreferences
                  initialPreferences={quotation.preferences}
                  onBack={prevStep}
                  onSubmit={async (prefs) => {
                    await updatePreferences(prefs);
                    await finalizeQuotation();
                  }}
                />
              )}

              {currentStep === 5 && quotation && (
                <QuotationResults
                  quotation={quotation}
                  onRestart={handleRestart}
                  onBack={prevStep}
                />
              )}
            </div>
          )}

          {activeTab !== "cotações" && (
            <div className="bg-white border border-slate-100 rounded-lg p-16 shadow-xs text-center max-w-[600px] mx-auto relative z-10">
              <h2 className="text-xl font-bold text-slate-900">{activeTab === "busca" ? "Busca ANS" : "Configurações"}</h2>
              <p className="text-slate-400 mt-4">Área em desenvolvimento (Beta).</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
