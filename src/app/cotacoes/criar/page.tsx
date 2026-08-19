"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuotation } from "../../../domains/quotation/hooks/useQuotation";
import { deleteQuotation } from "../../../domains/quotation/service";
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

function CriarCotacaoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quotationId = searchParams.get("id") || undefined;
  
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
    : (quotationId ? "Editar Cotação" : "Nova Cotação");

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
      
      <div className="max-w-[800px] mx-auto w-full">
        {!isDetailMode && (
          <div className="no-print">
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
                onRestart={handleBackToDashboard}
                onBack={handleBackToDashboard}
                onEdit={() => setCurrentStep(1)}
                onDelete={async () => {
                  if (confirm("Tem certeza que deseja excluir esta cotação?")) {
                    await deleteQuotation(quotation.id);
                    handleBackToDashboard();
                  }
                }}
                isDetailView={isDetailMode}
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

export default function CriarCotacaoPage() {
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
        <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-xs max-w-[800px] mx-auto w-full flex flex-col gap-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4 justify-between my-4">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      }>
        <CriarCotacaoContent />
      </Suspense>
    </DashboardLayout>
  );
}
