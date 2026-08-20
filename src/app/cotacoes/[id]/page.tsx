"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuotation } from "../../../domains/quotation/hooks/useQuotation";
import { DashboardLayout } from "../../../domains/shared/components/DashboardLayout";
import { QuotationStepper } from "../../../domains/quotation/components/QuotationWizard/components/QuotationStepper";
import { QuotationIdentification } from "../../../domains/quotation/components/QuotationWizard/components/QuotationIdentification";
import { QuotationProfile } from "../../../domains/quotation/components/QuotationWizard/components/QuotationProfile";
import { QuotationLives } from "../../../domains/quotation/components/QuotationWizard/components/QuotationLives";
import { QuotationPreferences } from "../../../domains/quotation/components/QuotationWizard/components/QuotationPreferences";
import { QuotationResults } from "../../../domains/quotation/components/QuotationResults/QuotationResults";
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
        {!isDetailMode && quotation && (
          <div className="no-print mb-8">
            <QuotationStepper 
              currentStep={currentStep} 
              isStepClickable={isStepClickable}
              onStepClick={setCurrentStep}
            />
          </div>
        )}

        {isLoading && !quotation ? (
          // Skeleton fiel ao layout final: breadcrumb + actions bar + grid de cards + sidebar
          <div className="w-full animate-pulse">
            {/* Breadcrumbs */}
            <div className="flex gap-2 mb-6">
              <div className="h-3 w-16 bg-slate-100 rounded" />
              <div className="h-3 w-2 bg-slate-100 rounded" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
            {/* Actions bar: título + botões */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="space-y-2">
                <div className="h-9 w-72 bg-slate-100 rounded-lg" />
                <div className="h-3 w-52 bg-slate-100 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-40 bg-slate-100 rounded-lg" />
                <div className="h-9 w-32 bg-slate-100 rounded-lg" />
                <div className="h-9 w-24 bg-slate-100 rounded-lg" />
                <div className="h-9 w-9 bg-slate-100 rounded-lg" />
              </div>
            </div>
            {/* Grid: cards de planos + sidebar */}
            <div className="flex gap-6 items-start flex-wrap">
              {/* Cards de planos */}
              <div className="flex-[3] min-w-[300px] grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 md:p-7 flex flex-col justify-between space-y-4">
                    {/* Avatar do operador */}
                    <div className="h-10 w-10 bg-slate-100 rounded-lg" />
                    {/* Nome + subtítulo + badges */}
                    <div className="space-y-2">
                      <div className="h-4 w-36 bg-slate-100 rounded" />
                      <div className="h-3 w-28 bg-slate-100 rounded" />
                      <div className="flex gap-2 mt-2">
                        <div className="h-5 w-20 bg-slate-50 rounded-sm" />
                        <div className="h-5 w-16 bg-slate-50 rounded-sm" />
                      </div>
                    </div>
                    {/* Preço */}
                    <div className="border-t border-slate-50 pt-4 space-y-1.5">
                      <div className="h-2.5 w-20 bg-slate-100 rounded" />
                      <div className="h-9 w-44 bg-slate-100 rounded" />
                    </div>
                    {/* Botão Ver detalhes */}
                    <div className="h-10 w-full bg-slate-100 rounded-lg" />
                  </div>
                ))}
              </div>
              {/* Sidebar */}
              <div className="flex-1 min-w-[280px] bg-slate-50 border border-slate-100 rounded-xl p-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="h-2.5 w-20 bg-slate-100 rounded" />
                  <div className="h-5 w-14 bg-slate-100 rounded" />
                  <div className="h-3 w-32 bg-slate-100 rounded" />
                </div>
                <div className="border-t border-slate-100 pt-4 space-y-1.5">
                  <div className="h-2.5 w-20 bg-slate-100 rounded" />
                  <div className="h-5 w-36 bg-slate-100 rounded" />
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 bg-slate-100 rounded-full" />
                  <div className="space-y-1">
                    <div className="h-3 w-36 bg-slate-100 rounded" />
                    <div className="h-2.5 w-24 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>
            </div>
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
        <div className="w-full animate-pulse">
          {/* Cabeçalho: botão voltar + título da página */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 bg-slate-100 rounded-lg border border-slate-200" />
            <div className="h-9 w-52 bg-slate-100 rounded-lg" />
          </div>
          {/* Breadcrumbs */}
          <div className="flex gap-2 mb-6">
            <div className="h-3 w-16 bg-slate-100 rounded" />
            <div className="h-3 w-2 bg-slate-100 rounded" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
          {/* Actions bar: título + botões */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="space-y-2">
              <div className="h-9 w-72 bg-slate-100 rounded-lg" />
              <div className="h-3 w-52 bg-slate-100 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-40 bg-slate-100 rounded-lg" />
              <div className="h-9 w-32 bg-slate-100 rounded-lg" />
              <div className="h-9 w-24 bg-slate-100 rounded-lg" />
              <div className="h-9 w-9 bg-slate-100 rounded-lg" />
            </div>
          </div>
          {/* Grid: cards de planos + sidebar */}
          <div className="flex gap-6 items-start flex-wrap">
            {/* Cards de planos */}
            <div className="flex-[3] min-w-[300px] grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 md:p-7 flex flex-col justify-between space-y-4">
                  {/* Avatar do operador */}
                  <div className="h-10 w-10 bg-slate-100 rounded-lg" />
                  {/* Nome + subtítulo + badges */}
                  <div className="space-y-2">
                    <div className="h-4 w-36 bg-slate-100 rounded" />
                    <div className="h-3 w-28 bg-slate-100 rounded" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-5 w-20 bg-slate-50 rounded-sm" />
                      <div className="h-5 w-16 bg-slate-50 rounded-sm" />
                    </div>
                  </div>
                  {/* Preço */}
                  <div className="border-t border-slate-50 pt-4 space-y-1.5">
                    <div className="h-2.5 w-20 bg-slate-100 rounded" />
                    <div className="h-9 w-44 bg-slate-100 rounded" />
                  </div>
                  {/* Botão Ver detalhes */}
                  <div className="h-10 w-full bg-slate-100 rounded-lg" />
                </div>
              ))}
            </div>
            {/* Sidebar */}
            <div className="flex-1 min-w-[280px] bg-slate-50 border border-slate-100 rounded-xl p-6 space-y-4">
              <div className="space-y-1.5">
                <div className="h-2.5 w-20 bg-slate-100 rounded" />
                <div className="h-5 w-14 bg-slate-100 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-1.5">
                <div className="h-2.5 w-20 bg-slate-100 rounded" />
                <div className="h-5 w-36 bg-slate-100 rounded" />
              </div>
              <div className="border-t border-slate-100 pt-4 flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 bg-slate-100 rounded-full" />
                <div className="space-y-1">
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                  <div className="h-2.5 w-24 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <EditarCotacaoContent />
      </Suspense>
    </DashboardLayout>
  );
}
