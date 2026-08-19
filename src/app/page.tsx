"use client";

import React from "react";
import { useQuotation } from "../hooks/useQuotation";
import { QuotationHeader } from "../components/QuotationHeader";
import { QuotationStepper } from "../components/QuotationStepper";
import { QuotationIdentification } from "../components/QuotationIdentification";
import { QuotationProfile } from "../components/QuotationProfile";
import { QuotationLives } from "../components/QuotationLives";
import { QuotationPreferences } from "../components/QuotationPreferences";
import { QuotationResults } from "../components/QuotationResults";

export default function Home() {
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
  } = useQuotation();

  const handleRestart = () => {
    setCurrentStep(1);
    window.location.reload();
  };

  return (
    <main style={{ padding: "2rem", display: "flex", flexDirection: "column", flex: 1, alignItems: "center" }}>
      {/* Ambient background glows */}
      <div className="ambient-bg">
        <div className="glow-blue"></div>
        <div className="glow-teal"></div>
      </div>

      <div style={{ width: "100%", maxWidth: "800px" }}>
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
            onBack={prevStep}
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
    </main>
  );
}
