"use client";

import React from "react";
import { DashboardLayout } from "../../domains/shared/components/DashboardLayout";
import { FiSearch, FiExternalLink } from "react-icons/fi";

export default function BuscaANSPage() {
  return (
    <DashboardLayout activeTab="busca">
      <div className="w-full">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Busca ANS</h1>
          <span className="text-[10px] bg-slate-100 text-slate-500 py-0.5 px-2 rounded font-bold uppercase">Beta</span>
        </div>
        <p className="text-slate-400 text-sm mb-8">Consulte operadoras, planos e coberturas registradas na ANS.</p>

        <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-xs max-w-[720px]">
          <div className="flex gap-3 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
              <FiSearch className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Pesquise por operadora, plano ou CNPJ..."
                className="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <button className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer uppercase tracking-wide">
              Buscar
            </button>
          </div>

          {/* Placeholder result area */}
          <div className="border border-dashed border-slate-200 rounded-lg p-12 text-center">
            <FiSearch className="text-slate-300 text-4xl mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Digite um termo acima para buscar planos e operadoras na base da ANS.</p>
            <a
              href="https://www.ans.gov.br/planos-de-saude-e-operadoras/informacoes-e-avaliacoes-de-operadoras"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-xs text-teal-600 hover:underline font-medium"
            >
              Acessar portal ANS <FiExternalLink />
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
