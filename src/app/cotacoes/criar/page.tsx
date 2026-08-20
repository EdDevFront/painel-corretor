"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuotation } from "../../../domains/quotation/hooks/useQuotation";
import { DashboardLayout } from "../../../domains/shared/components/DashboardLayout";
import { QuotationStepper } from "../../../domains/quotation/components/QuotationWizard/components/QuotationStepper";
import { QuotationWizardSteps } from "../../../domains/quotation/components/QuotationWizard/QuotationWizardSteps";
import { QuotationWizardSkeleton } from "../../../domains/quotation/components/QuotationWizard/components/QuotationWizardSkeleton";
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

  const [showSuccess, setShowSuccess] = useState(false);
  const [viewingPlanName, setViewingPlanName] = useState<string | null>(null);

  const handleBackToDashboard = () => router.push("/cotacoes");
  const handleViewQuotation = () => router.push(`/cotacoes/${quotation?.id}`);

  const handleFinalize = async (prefs: Parameters<typeof updatePreferences>[0]) => {
    await updatePreferences(prefs);
    await finalizeQuotation();
    setShowSuccess(true);
  };

  const handleBackClick = () => {
    const isViewingPlan = viewingPlanName !== null;
    const isMiddleStep = currentStep > 1 && currentStep < 5;
    
    if (isViewingPlan) {
      setViewingPlanName(null);
    } else if (isMiddleStep) {
      prevStep();
    } else {
      handleBackToDashboard();
    }
  };

  const isStepClickable = (stepNum: number): boolean => {
    const isFirstStep = stepNum === 1;
    if (isFirstStep) return true;
    
    const hasNoQuotation = !quotation;
    if (hasNoQuotation) return false;
    
    const isCompleted = quotation.status === "completed";
    if (isCompleted) return true;
    
    const isStep2Or3 = stepNum === 2 || stepNum === 3;
    if (isStep2Or3) return true;
    
    const isStep4 = stepNum === 4;
    const hasLives = quotation.lives.length > 0;
    if (isStep4) return hasLives;
    
    return false;
  };

  const isDetailMode = !!quotationId && quotation?.status === "completed" && currentStep === 5;
  const isFirstStep = currentStep === 1;
  const showStepper = !isDetailMode && !showSuccess;
  
  const isInitialLoad = !!quotationId && !quotation && isLoading;

  const detailTitle = viewingPlanName ? `${quotation?.title} â€” ${viewingPlanName}` : (quotation?.title || "Detalhes da CotaÃ§Ã£o");
  const defaultTitle = quotationId ? "Editar CotaÃ§Ã£o" : "Nova CotaÃ§Ã£o";
  const pageTitle = isDetailMode ? detailTitle : defaultTitle;

  return (
    <div className="w-full relative z-10 text-left">
      {!isFirstStep && (
        <div className="flex items-center gap-4 mb-8 no-print justify-start text-left">
          <IconButton type="button" onClick={handleBackClick} className="h-10 w-10 border-slate-200" title="Voltar">
            <FiArrowLeft className="text-slate-600 text-lg" />
          </IconButton>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">{pageTitle}</h1>
        </div>
      )}

      {isFirstStep && (
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">{pageTitle}</h1>
        </div>
      )}

      <div className="max-w-[800px] mx-auto w-full">
        {showStepper && (
          <div className="no-print">
            <QuotationStepper currentStep={currentStep} isStepClickable={isStepClickable} onStepClick={setCurrentStep} />
          </div>
        )}

        {isInitialLoad ? (
          <div className="mt-8"><QuotationWizardSkeleton /></div>
        ) : (
          <QuotationWizardSteps
            currentStep={currentStep}
            quotation={quotation}
            isLoading={isLoading}
            showSuccess={showSuccess}
            viewingPlanName={viewingPlanName}
            setViewingPlanName={setViewingPlanName}
            startNewQuotation={startNewQuotation}
            updateLives={updateLives}
            updatePreferences={updatePreferences}
            handleFinalize={handleFinalize}
            prevStep={prevStep}
            nextStep={nextStep}
            setCurrentStep={setCurrentStep}
            handleBackToDashboard={handleBackToDashboard}
            onViewQuotation={handleViewQuotation}
          />
        )}
      </div>
    </div>
  );
}

export default function CriarCotacaoPage() {
  const router = useRouter();

  const handleSetActiveTab = (tab: string) => {
    const isHome = tab === "inÃ­cio";
    const isCotacoes = tab === "cotaÃ§Ãµes";
    if (isHome) {
      router.push("/");
    } else if (isCotacoes) {
      router.push("/cotacoes");
    } else {
      router.push(`/?tab=${tab}`);
    }
  };

  return (
    <DashboardLayout activeTab="cotaÃ§Ãµes" setActiveTab={handleSetActiveTab}>
      <Suspense fallback={<QuotationWizardSkeleton />}>
        <CriarCotacaoContent />
      </Suspense>
    </DashboardLayout>
  );
}