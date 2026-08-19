"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Quotation } from "../../domains/quotation/types";
import { getQuotations, deleteQuotation } from "../../domains/quotation/service";
import { DashboardLayout } from "../../domains/shared/components/DashboardLayout";
import { QuotationList } from "../../domains/quotation/components/QuotationList";

function CotacoesPageContent() {
  const router = useRouter();
  const [allQuotations, setAllQuotations] = useState<Quotation[]>([]);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);

  const fetchList = () => {
    setIsListLoading(true);
    getQuotations()
      .then(setAllQuotations)
      .finally(() => setIsListLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id: string) => {
    setIsListLoading(true);
    await deleteQuotation(id);
    fetchList();
  };

  const handleNewQuotation = () => {
    router.push("/cotacoes/criar");
  };

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
      <QuotationList
        quotations={allQuotations}
        isLoading={isListLoading}
        onSelectQuotation={(id) => router.push(`/cotacoes/criar?id=${id}`)}
        onNewQuotation={handleNewQuotation}
        onDeleteQuotation={handleDelete}
      />
    </DashboardLayout>
  );
}

export default function CotacoesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen w-full bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin-custom" />
      </div>
    }>
      <CotacoesPageContent />
    </Suspense>
  );
}
