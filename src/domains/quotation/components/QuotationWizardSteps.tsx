import React from "react";
import { Quotation } from "../types";
import { QuotationIdentification } from "./QuotationIdentification";
import { QuotationProfile } from "./QuotationProfile";
import { QuotationLives } from "./QuotationLives";
import { QuotationPreferences } from "./QuotationPreferences";
import { QuotationResults } from "./QuotationResults";
import { QuotationSuccessScreen } from "./QuotationSuccessScreen";
import { deleteQuotation } from "../service";

interface QuotationWizardStepsProps {
  currentStep: number;
  quotation: Quotation | null;
  isLoading: boolean;
  showSuccess: boolean;
  viewingPlanName: string | null;
  setViewingPlanName: (name: string | null) => void;
  startNewQuotation: (title: string, clientName: string, brokerName: string, mode: any) => Promise<void>;
  updateLives: (lives: any[]) => Promise<void>;
  updatePreferences: (prefs: any) => Promise<void>;
  handleFinalize: (prefs: any) => Promise<void>;
  prevStep: () => void;
  nextStep: () => void;
  setCurrentStep: (step: number) => void;
  handleBackToDashboard: () => void;
  onViewQuotation: () => void;
}

export function QuotationWizardSteps({
  currentStep,
  quotation,
  isLoading,
  showSuccess,
  viewingPlanName,
  setViewingPlanName,
  startNewQuotation,
  updateLives,
  updatePreferences,
  handleFinalize,
  prevStep,
  nextStep,
  setCurrentStep,
  handleBackToDashboard,
  onViewQuotation,
}: QuotationWizardStepsProps) {
  const isStep1 = currentStep === 1;
  const isStep2 = currentStep === 2;
  const isStep3 = currentStep === 3 && quotation;
  const isStep4 = currentStep === 4 && quotation;
  const isStep5 = currentStep === 5 && !showSuccess && quotation;
  const isDetailMode = !!quotation && quotation.status === "completed" && currentStep === 5;

  const handleDelete = async () => {
    if (!quotation) return;
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta cotaÃƒÂ§ÃƒÂ£o?");
    if (confirmDelete) {
      await deleteQuotation(quotation.id);
      handleBackToDashboard();
    }
  };

  return (
    <>
      {isStep1 && (
        <QuotationIdentification
          initialTitle={quotation?.title}
          initialClient={quotation?.clientName}
          initialBroker={quotation?.brokerName}
          initialMode={quotation?.mode}
          onSubmit={startNewQuotation}
          onBack={handleBackToDashboard}
          isLoading={isLoading}
        />
      )}

      {isStep2 && (
        <QuotationProfile onBack={prevStep} onSubmit={nextStep} isLoading={isLoading} />
      )}

      {isStep3 && (
        <QuotationLives
          lives={quotation!.lives}
          onUpdateLives={updateLives}
          onBack={prevStep}
          onNext={nextStep}
          isLoading={isLoading}
        />
      )}

      {isStep4 && (
        <QuotationPreferences
          initialPreferences={quotation!.preferences}
          onBack={prevStep}
          onSubmit={handleFinalize}
          isLoading={isLoading}
        />
      )}

      {showSuccess && quotation && (
        <QuotationSuccessScreen
          quotation={quotation}
          onGoToList={handleBackToDashboard}
          onViewQuotation={onViewQuotation}
        />
      )}

      {isStep5 && (
        <QuotationResults
          quotation={quotation!}
          onRestart={handleBackToDashboard}
          onBack={handleBackToDashboard}
          onEdit={() => setCurrentStep(1)}
          onDelete={handleDelete}
          isDetailView={isDetailMode}
          selectedPlanName={viewingPlanName}
          onSelectPlanName={setViewingPlanName}
        />
      )}
    </>
  );
}