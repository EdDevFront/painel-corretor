"use client";

import React, { useState, useEffect } from "react";
import { useQuotation } from "../domains/quotation/hooks/useQuotation";
import { Quotation } from "../domains/quotation/types";
import { getQuotations } from "../domains/quotation/service";
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
    getQuotations().then(setAllQuotations);
  };

  useEffect(() => {
    fetchList();
  }, [viewState]);

  const handleSelectQuotation = (id: string) => {
    loadQuotation(id);
    setViewState("wizard");
    setCurrentStep(3); // Start draft at Step 3 (Lives) or load step based on state
  };

  const handleNewQuotation = () => {
    setViewState("wizard");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    setViewState("list");
    fetchList();
  };

  return (
    <div className="main-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="content-wrapper">
        <Navbar />
        
        <main className="main-content">
          <div className="ambient-bg">
            <div className="glow-blue"></div>
            <div className="glow-teal"></div>
          </div>

          {activeTab === "cotações" && viewState === "list" && (
            <QuotationList
              quotations={allQuotations}
              onSelectQuotation={handleSelectQuotation}
              onNewQuotation={handleNewQuotation}
            />
          )}

          {activeTab === "cotações" && viewState === "wizard" && (
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
            <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
              <h2>{activeTab === "busca" ? "Busca ANS" : "Configurações"}</h2>
              <p style={{ color: "var(--slate-400)", marginTop: "1rem" }}>Área em desenvolvimento (Beta).</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
