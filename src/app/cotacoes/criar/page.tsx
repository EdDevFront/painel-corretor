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

  const [showSuccess, setShowSuccess] = useState(false);
  const [viewingPlanName, setViewingPlanName] = useState<string | null>(null);

  const handleBackToDashboard = () => {
    router.push("/cotacoes");
  };

  const handleFinalize = async (prefs: Parameters<typeof updatePreferences>[0]) => {
    await updatePreferences(prefs);
    await finalizeQuotation();
    setShowSuccess(true);
  };

  const handleBackClick = () => {
    if (viewingPlanName) {
      setViewingPlanName(null);
    } else if (currentStep > 1 && currentStep < 5) {
      prevStep();
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
      {/* Top back button — hidden on step 1 */}
      {currentStep !== 1 && (
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
      )}

      {/* Title only (no back button) on step 1 */}
      {currentStep === 1 && (
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">
            {pageTitle}
          </h1>
        </div>
      )}

      <div className="max-w-[800px] mx-auto w-full">
        {!isDetailMode && !showSuccess && (
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
                onBack={prevStep}
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
                onSubmit={handleFinalize}
                isLoading={isLoading}
              />
            )}

            {/* Success screen shown right after finalization */}
            {showSuccess && quotation && (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Cotação criada com sucesso!</h2>
                <p className="text-slate-400 text-sm max-w-[400px] mb-2">
                  A cotação <strong className="text-slate-700">{quotation.title}</strong> foi gerada para{" "}
                  <strong className="text-slate-700">{quotation.clientName}</strong>.
                </p>
                <p className="text-slate-400 text-xs mb-8">
                  {quotation.lives?.length ?? 0} vidas incluídas • Gerada em {new Date(quotation.createdAt).toLocaleDateString("pt-BR")}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleBackToDashboard}
                    className="px-5 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white"
                  >
                    Ir para Cotações
                  </button>
                  <button
                    onClick={() => router.push(`/cotacoes/${quotation.id}`)}
                    className="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Ver cotação →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 5 && !showSuccess && quotation && (
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
        <div className="w-full animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="flex gap-2 mb-6">
            <div className="h-3 w-16 bg-slate-100 rounded" />
            <div className="h-3 w-2 bg-slate-100 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
          {/* Header row: title + action buttons */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-slate-100 rounded-lg" />
              <div className="h-3 w-48 bg-slate-100 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-36 bg-slate-100 rounded-lg" />
              <div className="h-9 w-28 bg-slate-100 rounded-lg" />
              <div className="h-9 w-20 bg-slate-100 rounded-lg" />
              <div className="h-9 w-9 bg-slate-100 rounded-lg" />
            </div>
          </div>
          {/* Grid: plan cards + sidebar */}
          <div className="flex gap-6 items-start">
            <div className="flex-3 min-w-[300px] grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 space-y-4">
                  <div className="h-10 w-10 bg-slate-100 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-5 w-20 bg-slate-50 rounded" />
                      <div className="h-5 w-16 bg-slate-50 rounded" />
                    </div>
                  </div>
                  <div className="border-t border-slate-50 pt-4 space-y-2">
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                    <div className="h-8 w-36 bg-slate-100 rounded" />
                  </div>
                  <div className="h-9 w-full bg-slate-100 rounded-lg" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-[260px] bg-slate-50 border border-slate-100 rounded-xl p-6 space-y-5">
              <div className="space-y-2">
                <div className="h-2 w-16 bg-slate-100 rounded" />
                <div className="h-5 w-12 bg-slate-100 rounded" />
                <div className="h-3 w-28 bg-slate-100 rounded" />
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="h-2 w-16 bg-slate-100 rounded" />
                <div className="h-5 w-32 bg-slate-100 rounded" />
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-3 items-center">
                <div className="h-3 w-3 bg-slate-100 rounded-full" />
                <div className="space-y-1">
                  <div className="h-3 w-32 bg-slate-100 rounded" />
                  <div className="h-2 w-24 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <CriarCotacaoContent />
      </Suspense>
    </DashboardLayout>
  );
}
