import React from "react";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";

interface FiltersState {
  filterPeriod: string;
  filterBroker: string;
  filterStatus: string;
  selectedMode: string;
}

interface QuotationFiltersDropdownProps {
  filters: FiltersState;
  onChange: (key: keyof FiltersState, value: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function QuotationFiltersDropdown({
  filters,
  onChange,
  onClear,
  onClose,
}: QuotationFiltersDropdownProps) {
  return (
    <div className="absolute left-0 mt-2 w-[280px] bg-white border border-slate-200 rounded-lg p-5 shadow-lg z-30 animate-fadeIn space-y-4">
      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Filtros</h4>

      <Select
        label="Período"
        value={filters.filterPeriod}
        onChange={(e) => onChange("filterPeriod", e.target.value)}
        hideErrorSpace={true}
      >
        <option value="any">Qualquer período</option>
        <option value="7days">Últimos 7 dias</option>
        <option value="30days">Últimos 30 dias</option>
      </Select>

      <Select
        label="Vendedor"
        value={filters.filterBroker}
        onChange={(e) => onChange("filterBroker", e.target.value)}
        hideErrorSpace={true}
      >
        <option value="">Qualquer vendedor</option>
        <option value="Beltrano Silva">Beltrano Silva</option>
        <option value="Ana Souza">Ana Souza</option>
        <option value="Carlos Oliveira">Carlos Oliveira</option>
        <option value="Fernanda Santos">Fernanda Santos</option>
      </Select>

      <Select
        label="Status"
        value={filters.filterStatus}
        onChange={(e) => onChange("filterStatus", e.target.value)}
        hideErrorSpace={true}
      >
        <option value="any">Qualquer status</option>
        <option value="viewed">Visualizado</option>
        <option value="unviewed">Não visualizado</option>
      </Select>

      <Select
        label="Modalidade"
        value={filters.selectedMode}
        onChange={(e) => onChange("selectedMode", e.target.value)}
        hideErrorSpace={true}
      >
        <option value="">Qualquer modalidade</option>
        <option value="PF">Pessoa Física (PF)</option>
        <option value="PME">Pequena e Média Empresa (PME)</option>
        <option value="ADESAO">Coletivo por Adesão</option>
      </Select>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClear}
          className="flex-1 text-xs py-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 hover:border-red-200 transition-colors normal-case"
        >
          Limpar
        </Button>
        <Button type="button" onClick={onClose} className="flex-1 text-xs py-2">
          Aplicar
        </Button>
      </div>
    </div>
  );
}
