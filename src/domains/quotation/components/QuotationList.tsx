import React, { useState } from "react";
import { Quotation } from "../types";
import { FiPlus, FiSliders, FiTrash2, FiFolder, FiEye } from "react-icons/fi";
import { TableSkeleton } from "../../../components/ui/TableSkeleton";
import { Button } from "../../../components/ui/Button";
import { IconButton } from "../../../components/ui/IconButton";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";

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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMode, setSelectedMode] = useState("");

  const completedQuotes = quotations.filter((q) => q.status === "completed");

  let filtered = completedQuotes.filter(
    (q) => q.clientName.toLowerCase().includes(search.toLowerCase()) ||
           q.brokerName.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedMode) {
    filtered = filtered.filter((q) => q.mode === selectedMode);
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteQuotation(id);
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cotações</h1>
      </div>

      <div className="flex gap-8 items-start flex-wrap">
        <div className="flex-3 min-w-[300px]">
          {/* Controls Bar */}
          <div className="flex justify-between gap-4 mb-4 items-center">
            {/* Grouped Search and Sliders on the left */}
            <div className="flex items-center gap-3 flex-1 max-w-[400px]">
              <div className="flex-1">
                <Input
                  placeholder="Procurar cotação..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="py-1 px-3"
                  hideErrorSpace={true}
                />
              </div>
              <IconButton 
                type="button" 
                onClick={() => setShowFilters(!showFilters)}
                className={`h-[42px] w-[42px] transition-colors border border-slate-200 hover:border-slate-300 ${showFilters ? "bg-teal-50 border-teal-200 text-teal-600" : ""}`}
              >
                <FiSliders />
              </IconButton>
            </div>
            
            <Button onClick={onNewQuotation}>
              <FiPlus className="text-base" /> Nova
            </Button>
          </div>

          {/* Collapsible Filters Drawer */}
          {showFilters && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6 shadow-xs flex flex-wrap gap-4 items-start animate-fadeIn">
              <div className="w-full md:w-[250px]">
                <Select 
                  label="Modalidade" 
                  value={selectedMode} 
                  onChange={(e) => setSelectedMode(e.target.value)}
                  hideErrorSpace={true}
                >
                  <option value="">Todas as Modalidades</option>
                  <option value="PF">Pessoa Física (PF)</option>
                  <option value="PME">Pequena e Média Empresa (PME)</option>
                  <option value="ADESAO">Coletivo por Adesão</option>
                </Select>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="h-[15px] hidden md:block" />
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setSelectedMode("");
                    setShowFilters(false);
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors normal-case"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}

          {/* Table Area */}
          {isLoading ? (
            <TableSkeleton />
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-lg shadow-xs p-16 text-center">
              <div className="flex justify-center text-slate-300 mb-4">
                <FiFolder className="text-5xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mt-4">Nenhuma cotação finalizada</h3>
              <p className="text-slate-400 text-sm mt-2">Clique em "Nova" no topo para criar a sua primeira cotação de plano de saúde.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-lg shadow-xs overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Cliente</th>
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
                      <td className="p-4 text-right flex justify-end gap-2">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectQuotation(q.id);
                          }}
                          className="border-none bg-transparent hover:bg-slate-50 p-2"
                          title="Visualizar Detalhes"
                        >
                          <FiEye className="text-base text-slate-400 hover:text-teal-600" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => handleDelete(q.id, e)}
                          className="border-none bg-transparent hover:bg-slate-50 p-2"
                          title="Excluir Cotação"
                        >
                          <FiTrash2 className="text-base text-slate-400 hover:text-red-500" />
                        </IconButton>
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
