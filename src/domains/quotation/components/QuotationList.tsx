import React, { useState } from "react";
import { Quotation } from "../types";
import { FiPlus, FiSliders, FiFolder } from "react-icons/fi";
import { TableSkeleton } from "../../../components/ui/TableSkeleton";
import { Button } from "../../../components/ui/Button";
import { IconButton } from "../../../components/ui/IconButton";
import { Input } from "../../../components/ui/Input/Input";
import { QuotationFiltersDropdown } from "./QuotationFiltersDropdown";
import { QuotationTable } from "./QuotationTable";

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
  const [filters, setFilters] = useState({
    filterPeriod: "any",
    filterBroker: "",
    filterStatus: "any",
    selectedMode: "",
  });

  const completedQuotes = quotations.filter((q) => q.status === "completed");

  let filtered = completedQuotes.filter(
    (q) =>
      q.clientName.toLowerCase().includes(search.toLowerCase()) ||
      q.brokerName.toLowerCase().includes(search.toLowerCase())
  );

  if (filters.selectedMode) filtered = filtered.filter((q) => q.mode === filters.selectedMode);
  if (filters.filterBroker) filtered = filtered.filter((q) => q.brokerName === filters.filterBroker);
  if (filters.filterStatus !== "any") {
    const wantsViewed = filters.filterStatus === "viewed";
    filtered = filtered.filter((q) => (wantsViewed ? !!q.viewed : !q.viewed));
  }
  if (filters.filterPeriod !== "any") {
    const now = new Date();
    const daysLimit = filters.filterPeriod === "7days" ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - daysLimit);
    filtered = filtered.filter((q) => new Date(q.createdAt) >= cutoff);
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteQuotation(id);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleClearFilters = () => {
    setFilters({ filterPeriod: "any", filterBroker: "", filterStatus: "any", selectedMode: "" });
    setShowFilters(false);
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cotações</h1>
      </div>

      <div className="flex gap-8 items-start flex-wrap">
        <div className="flex-[3] min-w-[300px]">
          {/* Controls bar */}
          <div className="flex justify-between gap-4 mb-4 items-center">
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
              <div className="relative">
                <IconButton
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-[42px] w-[42px] transition-colors border border-slate-200 hover:border-slate-300 ${
                    showFilters ? "bg-teal-50 border-teal-200 text-teal-600" : ""
                  }`}
                  title="Filtros"
                >
                  <FiSliders />
                </IconButton>

                {showFilters && (
                  <QuotationFiltersDropdown
                    filters={filters}
                    onChange={handleFilterChange}
                    onClear={handleClearFilters}
                    onClose={() => setShowFilters(false)}
                  />
                )}
              </div>
            </div>
            <Button onClick={onNewQuotation}>
              <FiPlus className="text-base" /> Nova
            </Button>
          </div>

          {/* Table area */}
          {isLoading ? (
            <TableSkeleton />
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-lg shadow-xs p-16 text-center">
              <div className="flex justify-center text-slate-300 mb-4">
                <FiFolder className="text-5xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mt-4">Nenhuma cotação encontrada</h3>
              <p className="text-slate-400 text-sm mt-2">
                Remova os filtros ou clique em "Nova" no topo para criar outra cotação.
              </p>
            </div>
          ) : (
            <QuotationTable
              quotations={filtered}
              onSelect={onSelectQuotation}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Metrics sidebar */}
        <div className="flex-1 min-w-[220px] flex flex-col gap-4">
          <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Cadastradas</span>
            <div className="text-4xl font-extrabold text-slate-900 mt-2">{completedQuotes.length}</div>
          </div>
          <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Visualizadas</span>
            <div className="text-4xl font-extrabold text-slate-300 mt-2">
              {completedQuotes.filter((q) => q.viewed).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
