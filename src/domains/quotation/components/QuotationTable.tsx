import React from "react";
import { Quotation } from "../types";
import { IconButton } from "../../../components/ui/IconButton";
import { FiEye, FiTrash2 } from "react-icons/fi";

interface QuotationTableProps {
  quotations: Quotation[];
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function QuotationTable({ quotations, onSelect, onDelete }: QuotationTableProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-lg shadow-xs overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Título</th>
            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Cliente</th>
            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Criada por</th>
            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((q) => (
            <tr
              key={q.id}
              onClick={() => onSelect(q.id)}
              className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors"
            >
              <td className="p-4 font-semibold text-slate-900">{q.title || "Sem título"}</td>
              <td className="p-4 text-slate-700 font-medium">{q.clientName}</td>
              <td className="p-4">
                <div className="font-medium text-slate-800">{q.brokerName}</div>
                <div className="text-[11px] text-slate-400">
                  {new Date(q.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                  <span className={`h-2 w-2 rounded-full ${q.viewed ? "bg-teal-500" : "bg-slate-300"}`} />
                  {q.viewed ? "Visualizado" : "Não visualizado"}
                </span>
              </td>
              <td className="p-4 text-right flex justify-end gap-2">
                <IconButton
                  onClick={(e) => { e.stopPropagation(); onSelect(q.id); }}
                  className="border-none bg-transparent hover:bg-slate-50 p-2"
                  title="Visualizar Detalhes"
                >
                  <FiEye className="text-base text-slate-400 hover:text-teal-600" />
                </IconButton>
                <IconButton
                  onClick={(e) => onDelete(q.id, e)}
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
  );
}
