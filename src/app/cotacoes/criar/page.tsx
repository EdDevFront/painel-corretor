"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuotation } from "../../../domains/quotation/hooks/useQuotation";
import { DashboardLayout } from "../../../domains/shared/components/DashboardLayout";
import { QuotationStepper } from "../../../domains/quotation/components/QuotationStepper";
import { QuotationIdentification } from "../../../domains/quotation/components/QuotationIdentification";
import { QuotationProfile } from "../../../domains/quotation/components/QuotationProfile";
import { QuotationLives } from "../../../domains/quotation/components/QuotationLives";
import { QuotationPreferences } from "../../../domains/quotation/components/QuotationPreferences";
import { QuotationResults } from "../../../domains/quotation/components/QuotationResults";
import { Skeleton } from "../../../components/ui/Skeleton";

function CriarCotacaoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quotationId = searchParams.get("id") || undefined;
  
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
  } = useQuotation(quotationId);

  const handleBackToDashboard = () => {
    router.push("/");
  };

  const isStepClickable = (stepNum: number): boolean => {
    if (stepNum === 1) return true;
    if (!quotation) return false;
    if (quotation.status === "completed") return true;
    if (stepNum === 2 || stepNum === 3) return true;
    if (stepNum === 4) return quotation.lives.length > 0;
    return false;
  };

  const pageTitle = quotationId ? "Editar Cotação" : "Nova Cotação";

  return (
    <div className="w-full relative z-10">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
        {pageTitle}
      </h1>
      
      <div className="max-w-[800px] mx-auto w-full">
        <QuotationStepper 
          currentStep={currentStep} 
          isStepClickable={isStepClickable}
          onStepClick={setCurrentStep}
        />

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
          onBack={prevStep}
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
