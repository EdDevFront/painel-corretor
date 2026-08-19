"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "../domains/shared/components/DashboardLayout";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "início";

  const [activeTab, setActiveTab] = useState("início");

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

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
    <DashboardLayout activeTab={activeTab} setActiveTab={handleSetActiveTab}>
      {activeTab === "início" && (
        <div className="w-full">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Início</h1>
          <div className="bg-white border border-slate-100 rounded-lg p-10 md:p-16 shadow-xs max-w-[600px] mx-auto text-center relative z-10">
            <h2 className="text-2xl font-bold text-slate-900">Olá, corretor!</h2>
            <p className="text-slate-400 mt-4 leading-relaxed text-sm">
              Bem-vindo ao seu painel. Escolha uma das opções no menu ao lado para navegar e gerenciar suas cotações de saúde de forma simplificada.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => handleSetActiveTab("cotações")}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-900 text-white py-3.5 px-7 rounded-lg hover:bg-slate-800 cursor-pointer transition-all shadow-md shadow-slate-200"
              >
                Acessar Cotações
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "início" && activeTab !== "cotações" && (
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen w-full bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin-custom" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
