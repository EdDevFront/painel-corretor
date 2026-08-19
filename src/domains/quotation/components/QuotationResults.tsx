import React, { useState } from "react";
import { Quotation, OperatorResult } from "../types";
import { Button } from "../../../components/ui/Button";
import { FiArrowLeft, FiEdit, FiTrash2, FiPrinter, FiPlus, FiChevronDown, FiChevronUp, FiSend, FiMoreVertical, FiActivity } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

interface ResultsProps {
  quotation: Quotation;
  onRestart: () => void;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDetailView?: boolean;
}

export function QuotationResults({ quotation, onRestart, onBack, onEdit, onDelete, isDetailView }: ResultsProps) {
  const results = quotation.results;
  const preferredOp = quotation.preferences.operatorId;

  // Plan Detail Sub-view State
  const [selectedPlan, setSelectedPlan] = useState<OperatorResult | null>(null);
  
  // Accordion Toggle States
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    copart: true, // Default expanded
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!results) {
    return (
      <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-xs">
        Nenhum resultado de cálculo disponível.
      </div>
    );
  }

  const displayedResults = preferredOp
    ? results.operatorResults.filter((r) => r.operatorId === preferredOp)
    : [...results.operatorResults].sort((a, b) => a.totalPrice - b.totalPrice);

  // Group lives by age brackets for breakdown
  const getAgeBracket = (age: number) => {
    if (age <= 18) return "0 a 18 anos";
    if (age <= 23) return "19 a 23 anos";
    if (age <= 28) return "24 a 28 anos";
    if (age <= 33) return "29 a 33 anos";
    if (age <= 38) return "34 a 38 anos";
    if (age <= 43) return "39 a 43 anos";
    if (age <= 48) return "44 a 48 anos";
    if (age <= 53) return "49 a 53 anos";
    if (age <= 58) return "54 a 58 anos";
    return "59 anos ou mais";
  };

  const getAgeGroups = (plan: OperatorResult) => {
    const groups: Record<string, { count: number; unitPrice: number; total: number }> = {};
    
    quotation.lives.forEach((life) => {
      const bracket = getAgeBracket(life.age);
      const priceDetail = plan.livesPrices.find((lp) => lp.lifeId === life.id);
      const price = priceDetail ? priceDetail.price : 0;
      
      if (!groups[bracket]) {
        groups[bracket] = { count: 0, unitPrice: price, total: 0 };
      }
      groups[bracket].count += 1;
      groups[bracket].total += price;
    });

    return Object.entries(groups).map(([bracket, info]) => ({
      bracket,
      count: info.count,
      unitPrice: info.unitPrice,
      total: info.total,
    }));
  };

  // --- 1. RENDER PLAN DETAIL SUB-VIEW ---
  if (selectedPlan) {
    const ageGroups = getAgeGroups(selectedPlan);
    return (
      <div className="w-full relative z-10 animate-fadeIn">
        {/* Header Block */}
        <div className="flex justify-between items-center mb-6 no-print">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedPlan.operatorName}</h2>
            <p className="text-slate-500 text-xs mt-1">Dona Saúde Saúde {quotation.mode}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setSelectedPlan(null)}>
              <FiArrowLeft className="mr-1.5" /> Voltar para Planos
            </Button>
          </div>
        </div>

        {/* Plan Details Grid Layout */}
        <div className="flex gap-6 items-start flex-wrap">
          {/* Left Panel: Accordions */}
          <div className="flex-3 min-w-[300px] space-y-3">
            {/* Coparticipação Accordion */}
            <div className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-xs">
              <button 
                onClick={() => toggleAccordion("copart")}
                className="w-full p-4 flex justify-between items-center font-bold text-slate-800 hover:bg-slate-50 text-left text-sm"
              >
                <span>{quotation.preferences.coparticipation ? "Com coparticipação" : "Sem coparticipação"}</span>
                {openAccordions.copart ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openAccordions.copart && (
                <div className="p-4 pt-0 border-t border-slate-50 text-xs text-slate-500 leading-relaxed">
                  {quotation.preferences.coparticipation 
                    ? "Possui custos adicionais reduzidos para a realização de consultas, exames simples, e procedimentos médicos eletivos."
                    : "Não possui custos adicionais para realização de consultas, exames, procedimentos ou internações corporativas."}
                </div>
              )}
            </div>

            {/* Other Accordions */}
            {[
              { id: "area", title: "Área de Comercialização / Utilização", desc: "Disponível para toda a Região Metropolitana e capitais associadas." },
              { id: "cancel", title: "Cancelamento do Contrato", desc: "Cancelamento sem carência ou multas rescisórias em até 30 dias após a assinatura formal." },
              { id: "carencias", title: "Carências", desc: "Urgência e emergência: 24h. Consultas e exames simples: 30 dias. Procedimentos complexos: 180 dias. Parto: 300 dias." },
              { id: "composition", title: "Composição / Quem Pode Aderir", desc: "Sócios, administradores e funcionários com vínculo CLT ativo." },
              { id: "docs", title: "Documentos Necessários", desc: "RG, CPF, Comprovante de Residência e Contrato Social ou Certificado de MEI." },
              { id: "pay", title: "Forma de Pagamento", desc: "Boleto bancário mensal com vencimento selecionado na assinatura da proposta." },
              { id: "prod", title: "Produto", desc: "Plano corporativo regulamentado pela ANS nº 489.120/21-8." }
            ].map((acc) => (
              <div key={acc.id} className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-xs">
                <button 
                  onClick={() => toggleAccordion(acc.id)}
                  className="w-full p-4 flex justify-between items-center font-bold text-slate-800 hover:bg-slate-50 text-left text-sm"
                >
                  <span>{acc.title}</span>
                  {openAccordions[acc.id] ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openAccordions[acc.id] && (
                  <div className="p-4 pt-0 border-t border-slate-50 text-xs text-slate-500 leading-relaxed">
                    {acc.desc}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Panel: Pricing breakdown card */}
          <div className="flex-1 min-w-[280px] space-y-4">
            <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-1">{selectedPlan.operatorName}</h3>
              <input 
                type="text" 
                placeholder="Adicione um comentário..." 
                className="w-full mt-2 mb-4 p-2 text-xs border border-slate-100 rounded-md focus:outline-hidden focus:border-teal-500 bg-slate-50/50"
              />

              <div className="space-y-3 mb-6">
                {ageGroups.map((g) => (
                  <div key={g.bracket} className="flex justify-between text-xs text-slate-600">
                    <span>{g.bracket}</span>
                    <strong className="font-semibold text-slate-900">
                      {g.count} x R$ {g.unitPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline mb-5">
                <span className="text-xs text-slate-400">Total Mensal</span>
                <div className="text-2xl font-extrabold text-slate-900">
                  R$ {selectedPlan.totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}<span className="text-xs font-normal text-slate-400">/mês</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => window.open(`https://wa.me/5500000000000?text=Tenho%20interesse%20no%20plano%20${selectedPlan.operatorName}`)}
                className="w-full bg-[#25d366] text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-colors cursor-pointer shadow-xs"
              >
                <FaWhatsapp className="text-lg" /> Tenho interesse
              </button>
            </div>

            {/* Hospital coverage preview cards */}
            <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">40 Hospitais</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Confira os principais hospitais da rede.</p>
              </div>
              <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <FiPlus />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">6 Laboratórios</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Confira os laboratórios credenciados.</p>
              </div>
              <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <FiActivity />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. RENDER MAIN RESULTS COMPARATIVE GRID ---
  return (
    <div className="w-full relative z-10 animate-fadeIn">
      {/* Dynamic Actions Bar at the top */}
      <div className="flex justify-between items-center mb-6 no-print flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{quotation.title || "Resultado Comparativo"}</h2>
          <p className="text-slate-400 text-xs mt-1">Cotação gerada em {new Date(quotation.createdAt).toLocaleDateString("pt-BR")}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            <FiPrinter className="mr-1" /> Imprimir
          </Button>
          <Button variant="secondary" onClick={() => alert("Link de proposta gerado com sucesso!")}>
            Ver hospitais
          </Button>
          <Button onClick={() => alert("Proposta enviada ao cliente!")} className="flex items-center gap-1.5">
            <FiSend /> Enviar
          </Button>
          
          <div className="relative">
            <IconButton 
              type="button" 
              onClick={onEdit}
              className="border-slate-200"
              title="Opções da Cotação"
            >
              <FiMoreVertical />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Grid Comparison Layout */}
      <div className="flex gap-6 items-start flex-wrap">
        {/* Left column: Plan Cards Grid */}
        <div className="flex-3 min-w-[300px] grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedResults.map((opResult: OperatorResult) => (
            <div key={opResult.operatorId} className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 hover:shadow-sm transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center font-extrabold text-sm border border-amber-500/20 shadow-xs">
                  {opResult.operatorName.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block">Mensalidade</span>
                  <div className="text-lg font-black text-slate-900">
                    R$ {opResult.totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-5">
                <h3 className="font-bold text-slate-900 text-sm">{opResult.operatorName}</h3>
                <p className="text-[10px] text-slate-500">Saúde {quotation.mode} • {quotation.preferences.hospitalNetwork === "premium" ? "Rede Premium" : "Rede Básica"}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px] text-slate-400">
                  <span className="bg-slate-50 px-2 py-0.5 rounded-sm">40 Hospitais</span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded-sm">{quotation.preferences.coparticipation ? "Copart" : "Sem copart"}</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="secondary" 
                className="w-full text-xs py-2 normal-case font-bold"
                onClick={() => setSelectedPlan(opResult)}
              >
                Ver detalhes
              </Button>
            </div>
          ))}

          {/* Add Plan Card placeholder */}
          <div className="border border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 min-h-[180px] hover:bg-slate-50/50 cursor-pointer transition-all" onClick={onRestart}>
            <FiPlus className="text-3xl mb-2 text-slate-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Adicionar Plano</span>
          </div>
        </div>

        {/* Right column: Technical Summary Sidebar */}
        <div className="flex-1 min-w-[280px] bg-white border border-slate-100 rounded-lg p-5 shadow-xs space-y-4">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Distribuição</span>
            <div className="text-lg font-bold text-slate-800 mt-1">Geral</div>
            <div className="text-xs text-slate-500 mt-0.5">{results.totalLives} {results.totalLives === 1 ? "vida" : "vidas"} cadastrada(s)</div>
          </div>

          <div className="border-t border-slate-50 pt-4">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">CNPJ / CPF</span>
            <div className="text-sm font-semibold text-slate-800 mt-1">
              {quotation.mode === "PME" ? "Informado (PME)" : "Não informado"}
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4 flex items-center gap-2.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <div>
              <span>Criada por <strong className="font-semibold text-slate-700">{quotation.brokerName}</strong></span>
              <p className="text-[10px] text-slate-400 mt-0.5">há alguns instantes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
