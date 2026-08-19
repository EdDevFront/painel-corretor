"use client";

import React, { Suspense } from "react";
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

  const handleBackToDashboard = () => {
    router.push("/cotacoes");
  };

  if (isLoading) {
    return (
      <div className="w-full relative z-10 animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="max-w-[800px] mx-auto w-full space-y-6">
          {/* Stepper Skeleton */}
          <div className="flex justify-between mb-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>

          {/* Banner */}
          <Skeleton className="h-16 w-full rounded-lg" />

          {/* Top Buttons */}
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 flex-1 rounded-md" />
          </div>

          {/* Results card */}
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>

          {/* Summary card */}
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const isStepClickable = (stepNum: number): boolean => {
    if (stepNum === 1) return true;
    if (!quotation) return false;
    if (quotation.status === "completed") return true;
    if (stepNum === 2 || stepNum === 3) return true;
    if (stepNum === 4) return quotation.lives.length > 0;
    return false;
  };

  const isDetailMode = !!quotationId && quotation?.status === "completed" && currentStep === 5;
  const pageTitle = isDetailMode ? "Detalhes da Cotação" : (quotationId ? "Editar Cotação" : "Nova Cotação");

  return (
    <div className="w-full relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <IconButton 
          type="button" 
          onClick={handleBackToDashboard}
          className="h-10 w-10 border-slate-200"
          title="Voltar para Cotações"
        >
          <FiArrowLeft className="text-slate-600 text-lg" />
        </IconButton>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {pageTitle}
        </h1>
      </div>
      
      <div className="max-w-[800px] mx-auto w-full">
        {!isDetailMode && (
          <QuotationStepper 
            currentStep={currentStep} 
            isStepClickable={isStepClickable}
            onStepClick={setCurrentStep}
          />
        )}

      {currentStep === 1 && (
        <QuotationIdentification
          initialClient={quotation?.clientName}
          initialBroker={quotation?.brokerName}
          initialMode={quotation?.mode}
          onSubmit={startNewQuotation}
          onBack={handleBackToDashboard}
        />
      )}

      {currentStep === 2 && (
        <QuotationProfile
          onBack={handleBackToDashboard}
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
        />
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
