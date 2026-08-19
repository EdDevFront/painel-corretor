"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quotation } from "../domains/quotation/types";
import { getQuotations, deleteQuotation } from "../domains/quotation/service";
import { DashboardLayout } from "../domains/shared/components/DashboardLayout";
import { QuotationList } from "../domains/quotation/components/QuotationList";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("cotações");
  const [allQuotations, setAllQuotations] = useState<Quotation[]>([]);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);

  const fetchList = () => {
    setIsListLoading(true);
    getQuotations()
      .then(setAllQuotations)
      .finally(() => setIsListLoading(false));
  };

  useEffect(() => {
    if (activeTab === "cotações") {
      fetchList();
    }
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    setIsListLoading(true);
    await deleteQuotation(id);
    fetchList();
  };

  const handleNewQuotation = () => {
    router.push("/cotacoes/criar");
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "cotações" && (
        <QuotationList
          quotations={allQuotations}
          isLoading={isListLoading}
          onSelectQuotation={(id) => router.push(`/cotacoes/criar?id=${id}`)} // Redirect to edit
          onNewQuotation={handleNewQuotation}
          onDeleteQuotation={handleDelete}
        />
      )}

      {activeTab !== "cotações" && (
        <div className="w-full">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
            {activeTab === "busca" ? "Busca ANS" : "Configurações"}
          </h1>
          <div className="bg-white border border-slate-100 rounded-lg p-16 shadow-xs text-center max-w-[600px] mx-auto relative z-10">
            <h2 className="text-xl font-bold text-slate-900">{activeTab === "busca" ? "Busca ANS" : "Configurações"}</h2>
            <p className="text-slate-400 mt-4">Área em desenvolvimento (Beta).</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
