import React from "react";
import { FiSliders, FiX, FiPrinter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { Button } from "../../../components/ui/Button";

interface QuotationShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotationId: string;
}

export function QuotationShareModal({ isOpen, onClose, quotationId }: QuotationShareModalProps) {
  if (!isOpen) return null;

  const shareUrl = `https://app.cotaco.es/c/${quotationId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copiado com sucesso!");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[200] animate-fadeIn no-print text-left">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[450px] shadow-2xl relative border border-slate-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Compartilhar</h3>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-600 p-1 bg-transparent border-none cursor-pointer">
              <FiSliders className="text-sm" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 bg-transparent border-none cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        {/* Share Channels */}
        <div className="flex justify-around items-center mb-6">
          <button
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?text=Confira%20sua%20proposta%20de%20plano%20de%20saude:%20${shareUrl}`
              )
            }
            className="flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent"
          >
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#25d366] group-hover:text-white transition-all shadow-xs">
              <FaWhatsapp className="text-2xl" />
            </div>
            <span className="text-xs text-slate-500 font-medium">WhatsApp</span>
          </button>

          <button
            onClick={() =>
              window.open(
                `mailto:?subject=Proposta%20de%20Plano%20de%20Saude&body=Confira%20sua%20proposta:%20${shareUrl}`
              )
            }
            className="flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent"
          >
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
              <FiMail className="text-2xl" />
            </div>
            <span className="text-xs text-slate-500 font-medium">E-mail</span>
          </button>

          <button
            onClick={() => {
              onClose();
              window.print();
            }}
            className="flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent"
          >
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-all shadow-xs">
              <FiPrinter className="text-2xl" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Imprimir</span>
          </button>
        </div>

        {/* Copy Link */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-sm text-slate-600 px-2 focus:outline-hidden"
          />
          <Button onClick={handleCopy} className="text-sm py-1.5 px-4 rounded-md">
            Copiar
          </Button>
        </div>
      </div>
    </div>
  );
}