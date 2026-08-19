"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../domains/shared/components/DashboardLayout";
import { FiUser, FiBell, FiShield, FiGlobe } from "react-icons/fi";

const sections = [
  { id: "perfil", label: "Perfil", icon: <FiUser /> },
  { id: "notificacoes", label: "Notificações", icon: <FiBell /> },
  { id: "seguranca", label: "Segurança", icon: <FiShield /> },
  { id: "preferencias", label: "Preferências", icon: <FiGlobe /> },
];

export default function ConfiguracoesPage() {
  const [active, setActive] = useState("perfil");

  return (
    <DashboardLayout activeTab="configurações">
      <div className="w-full">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Configurações</h1>

        <div className="flex gap-6 items-start">
          {/* Left nav */}
          <div className="w-[220px] shrink-0 bg-white border border-slate-100 rounded-xl p-3 shadow-xs">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none text-left ${
                  active === s.id
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 bg-transparent"
                }`}
              >
                <span className="text-base">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="flex-1 bg-white border border-slate-100 rounded-xl p-8 shadow-xs">
            {active === "perfil" && (
              <div className="space-y-6 max-w-[500px]">
                <h2 className="text-lg font-bold text-slate-900">Informações do Perfil</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nome</label>
                    <input
                      type="text"
                      defaultValue="Beltrano Silva"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">E-mail</label>
                    <input
                      type="email"
                      defaultValue="beltrano@corretor.com"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">CRECI</label>
                    <input
                      type="text"
                      defaultValue="12345-SP"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <button className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer uppercase tracking-wide">
                    Salvar alterações
                  </button>
                </div>
              </div>
            )}

            {active === "notificacoes" && (
              <div className="space-y-6 max-w-[500px]">
                <h2 className="text-lg font-bold text-slate-900">Notificações</h2>
                {[
                  { label: "Novas cotações", desc: "Receber alerta quando uma cotação for criada" },
                  { label: "Atualizações de planos", desc: "Alertar quando um plano mudar de preço" },
                  { label: "Relatórios semanais", desc: "Resumo semanal das cotações por e-mail" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-none">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{item.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                    <div className="w-10 h-5 bg-teal-500 rounded-full flex items-center justify-end px-0.5 cursor-pointer shrink-0">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {active === "seguranca" && (
              <div className="space-y-6 max-w-[500px]">
                <h2 className="text-lg font-bold text-slate-900">Segurança</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Senha atual</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nova senha</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <button className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer uppercase tracking-wide">
                    Atualizar senha
                  </button>
                </div>
              </div>
            )}

            {active === "preferencias" && (
              <div className="space-y-6 max-w-[500px]">
                <h2 className="text-lg font-bold text-slate-900">Preferências</h2>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Idioma</label>
                  <select className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-teal-500">
                    <option>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Moeda padrão</label>
                  <select className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-teal-500">
                    <option>Real (BRL)</option>
                    <option>Dólar (USD)</option>
                  </select>
                </div>
                <button className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer uppercase tracking-wide">
                  Salvar preferências
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
