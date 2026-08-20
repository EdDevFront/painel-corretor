import React from "react";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";

interface Hospital {
  name: string;
  sub: string;
  type: string;
}

interface HospitalGroup {
  region: string;
  items: Hospital[];
}

interface QuotationHospitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  groups: HospitalGroup[];
  search: string;
  onSearchChange: (value: string) => void;
}

export function QuotationHospitalsModal({
  isOpen,
  onClose,
  planName,
  groups,
  search,
  onSearchChange,
}: QuotationHospitalsModalProps) {
  if (!isOpen) return null;

  const filtered = groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.sub.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[200] animate-fadeIn no-print text-left">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[650px] shadow-2xl relative border border-slate-100 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-950 font-bold text-sm bg-transparent border-none cursor-pointer"
          >
            <FiArrowLeft className="text-base" />
            <span>Rede credenciada</span>
          </button>
          <div className="w-[180px]">
            <input
              type="text"
              placeholder="Procurar..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full py-1 px-3 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-teal-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Selected Plan Header */}
        <div className="flex flex-col items-center justify-center py-4 border-b border-slate-100 mb-4">
          <div className="h-14 w-14 shrink-0 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center font-extrabold text-xl border border-amber-500/20 shadow-xs mb-2">
            {planName.substring(0, 2).toUpperCase()}
          </div>
          <h4 className="font-extrabold text-slate-950 text-base">{planName}</h4>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Enfermaria</span>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto flex-1 space-y-6 pr-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Nenhum hospital encontrado para a sua busca.
            </div>
          ) : (
            filtered.map((group) => (
              <div key={group.region}>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                  <FiMapPin className="text-teal-600 text-base" />
                  <span>{group.region}</span>
                </div>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 flex justify-between items-center text-sm"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-slate-400 mt-0.5">{item.sub}</div>
                      </div>
                      <span className="bg-white border border-slate-100 text-xs font-bold text-slate-500 px-2 py-0.5 rounded-sm">
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
