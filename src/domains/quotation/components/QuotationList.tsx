import React, { useState } from "react";
import { Quotation } from "../types";
import { FiPlus, FiSearch, FiSliders, FiTrash2, FiFolderOpen } from "react-icons/fi";
import { Spinner } from "../../shared/components/ui/Spinner";

interface ListProps {
  quotations: Quotation[];
  isLoading: boolean;
  onSelectQuotation: (id: string) => void;
  onNewQuotation: () => void;
  onDeleteQuotation: (id: string) => void;
}

export function QuotationList({
  quotations,
  isLoading,
  onSelectQuotation,
  onNewQuotation,
  onDeleteQuotation,
}: ListProps) {
  const [search, setSearch] = useState("");

  const completedQuotes = quotations.filter((q) => q.status === "completed");

  const filtered = completedQuotes.filter(
    (q) => q.clientName.toLowerCase().includes(search.toLowerCase()) ||
           q.brokerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteQuotation(id);
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cotações Finalizadas</h1>
      </div>

      <div className="flex gap-8 items-start flex-wrap">
        <div className="flex-3 min-w-[300px]">
          {/* Controls Bar */}
          <div className="flex justify-between gap-4 mb-6">
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-1.5 bg-white flex-1 max-w-[300px]">
              <FiSearch className="text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Procurar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-none outline-none text-sm w-full h-[28px] focus:ring-0"
              />
            </div>
            <button className="flex items-center justify-center p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer">
              <FiSliders />
            </button>
            <button onClick={onNewQuotation} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white py-2.5 px-5 rounded-lg hover:bg-slate-800 cursor-pointer transition-all shadow-md shadow-slate-200">
              <FiPlus /> Nova
            </button>
          </div>

          {/* Table Area */}
          {isLoading ? (
            <div className="bg-white border border-slate-100 rounded-lg shadow-xs p-16 flex items-center justify-center">
              <Spinner />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-lg shadow-xs p-16 text-center">
              <div className="flex justify-center text-slate-300 mb-4">
                <FiFolderOpen className="text-5xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mt-4">Nenhuma cotação finalizada</h3>
              <p className="text-slate-400 text-sm mt-2">Clique em "+ Nova" no topo para criar a sua primeira cotação de plano de saúde.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-lg shadow-xs overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Título</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Criada por</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => onSelectQuotation(q.id)}
                      className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-900">{q.clientName}</td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{q.brokerName}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(q.createdAt).toLocaleDateString("pt-BR")}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => handleDelete(q.id, e)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-50 cursor-pointer transition-all inline-flex items-center justify-center"
                        >
                          <FiTrash2 className="text-base" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Metrics Column */}
        <div className="flex-1 min-w-[220px] flex flex-col gap-4">
          <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Cadastradas</span>
            <div className="text-4xl font-extrabold text-slate-900 mt-2">{completedQuotes.length}</div>
          </div>
          <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Visualizadas</span>
            <div className="text-4xl font-extrabold text-slate-300 mt-2">-</div>
          </div>
        </div>
      </div>
    </div>
  );
}
