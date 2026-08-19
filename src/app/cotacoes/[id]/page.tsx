"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuotation } from "../../../domains/quotation/hooks/useQuotation";
import { DashboardLayout } from "../../../domains/shared/components/DashboardLayout";
import { QuotationStepper } from "../../../domains/quotation/components/QuotationStepper";
import { QuotationIdentification } from "../../../domains/quotation/components/QuotationIdentification";
import { QuotationProfile } from "../../../domains/quotation/components/QuotationProfile";
import { QuotationLives } from "../../../domains/quotation/components/QuotationLives";
import { QuotationPreferences } from "../../../domains/quotation/components/QuotationPreferences";
import { QuotationResults } from "../../../domains/quotation/components/QuotationResults";
import { Skeleton } from "../../../components/ui/Skeleton";
import { IconButton } from "../../../components/ui/IconButton";
import { FiArrowLeft } from "react-icons/fi";

function EditarCotacaoContent() {
  const router = useRouter();
  const params = useParams();
  const quotationId = params?.id as string;
  
  const {
    quotation,
    currentStep,
    isLoading,
    startNewQuotation,
    updateLives,
    updatePreferences,
    finalizeQuotation,
    prevStep,
    nextStep,
    setCurrentStep,
  } = useQuotation(quotationId);

  const [viewingPlanName, setViewingPlanName] = useState<string | null>(null);

  const handleBackToDashboard = () => {
    router.push("/cotacoes");
  };

  const handleBackClick = () => {
    if (viewingPlanName) {
      setViewingPlanName(null);
    } else {
      handleBackToDashboard();
    }
  };

  const isStepClickable = (stepNum: number): boolean => {
    if (stepNum === 1) return true;
    if (!quotation) return false;
    if (quotation.status === "completed") return true;
    if (stepNum === 2 || stepNum === 3) return true;
    if (stepNum === 4) return quotation.lives.length > 0;
    return false;
  };

  const isDetailMode = !!quotationId && quotation?.status === "completed" && currentStep === 5;
  const pageTitle = isDetailMode 
    ? (viewingPlanName ? `${quotation?.title} — ${viewingPlanName}` : (quotation?.title || "Detalhes da Cotação")) 
    : "Editar Cotação";

  const handleEditWizard = () => {
    setCurrentStep(1);
  };

  return (
    <div className="w-full relative z-10 text-left">
      <div className="flex items-center gap-4 mb-8 no-print justify-start text-left">
        <IconButton 
          type="button" 
          onClick={handleBackClick}
          className="h-10 w-10 border-slate-200"
          title="Voltar"
        >
          <FiArrowLeft className="text-slate-600 text-lg" />
        </IconButton>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">
          {pageTitle}
        </h1>
      </div>
      
      <div className="max-w-[800px] mx-auto w-full text-left">
        {!isDetailMode && (
          <div className="no-print mb-8">
            <QuotationStepper 
              currentStep={currentStep} 
              isStepClickable={isStepClickable}
              onStepClick={setCurrentStep}
            />
          </div>
        )}

        {isLoading && !quotation ? (
          <div className="space-y-6 animate-pulse mt-8">
            {currentStep === 5 ? (
              <>
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
                <Skeleton className="h-32 w-full rounded-lg" />
              </>
            ) : (
              <>
                <Skeleton className="h-12 w-full rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-12 w-32 rounded-lg ml-auto" />
              </>
            )}
          </div>
        ) : (
          <>
            {currentStep === 1 && (
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

            {currentStep === 2 && (
              <QuotationProfile
                onBack={handleBackToDashboard}
                onSubmit={() => nextStep()}
                isLoading={isLoading}
              />
            )}

            {currentStep === 3 && quotation && (
              <QuotationLives
                lives={quotation.lives}
                onUpdateLives={updateLives}
                onBack={prevStep}
                onNext={nextStep}
                isLoading={isLoading}
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
                isLoading={isLoading}
              />
            )}

            {currentStep === 5 && quotation && (
              <QuotationResults
                quotation={quotation}
                onRestart={() => setCurrentStep(1)}
                onBack={prevStep}
                onEdit={handleEditWizard}
                onDelete={handleBackToDashboard}
                selectedPlanName={viewingPlanName}
                onSelectPlanName={setViewingPlanName}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function EditarCotacaoPage() {
  const router = useRouter();
  
  const handleSetActiveTab = (tab: string) => {
    if (tab === "início") {
      router.push("/");
    } else if (tab === "cotações") {
      router.push("/cotacoes");
    } else {
      router.push(`/?tab=${tab}`);
    }
  };

  return (
    <DashboardLayout activeTab="cotações" setActiveTab={handleSetActiveTab}>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px] w-full">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin-custom" />
        </div>
      }>
        <EditarCotacaoContent />
      </Suspense>
    </DashboardLayout>
  );
}
