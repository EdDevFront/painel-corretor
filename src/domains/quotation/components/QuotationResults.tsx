import React, { useState } from "react";
import { Quotation, OperatorResult } from "../types";
import { Button } from "../../../components/ui/Button";
import { IconButton } from "../../../components/ui/IconButton";
import { 
  FiArrowLeft, FiEdit, FiTrash2, FiPrinter, FiPlus, 
  FiChevronDown, FiChevronUp, FiSend, FiMoreVertical, 
  FiActivity, FiX, FiShare2, FiSliders, FiCopy, FiMapPin, FiMail 
} from "react-icons/fi";
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
  
  // Custom Modals & Menu States
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isHospitalsOpen, setIsHospitalsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hospitalsSearch, setHospitalsSearch] = useState("");

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

  // Filtered mock hospitals list based on search input
  const mockHospitals = [
    {
      region: "São Paulo - Centro",
      items: [
        { name: "Hospital BP", sub: "Bela Vista", type: "H, PS" },
        { name: "Leforte", sub: "Liberdade", type: "H, PS" },
      ]
    },
    {
      region: "São Paulo - Zona Sul",
      items: [
        { name: "Hospital Santa Joana", sub: "Paraíso", type: "M, H" },
      ]
    }
  ];

  const filteredHospitals = mockHospitals.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.name.toLowerCase().includes(hospitalsSearch.toLowerCase()) ||
      item.sub.toLowerCase().includes(hospitalsSearch.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  // --- 1. RENDER PLAN DETAIL SUB-VIEW ---
  if (selectedPlan) {
    const ageGroups = getAgeGroups(selectedPlan);
    return (
      <div className="w-full relative z-10 animate-fadeIn">
        {/* Header Block */}
        <div className="flex justify-between items-center mb-6 no-print flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedPlan.operatorName}</h2>
            <p className="text-slate-500 text-xs mt-1">Dona Saúde Saúde {quotation.mode}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => window.print()}>
              <FiPrinter className="mr-1.5" /> Imprimir Proposta
            </Button>
            <Button variant="secondary" onClick={() => setSelectedPlan(null)}>
              <FiArrowLeft className="mr-1.5" /> Voltar para Planos
            </Button>
          </div>
        </div>

        {/* Plan Details Grid Layout */}
        <div className="flex gap-6 items-start flex-wrap print:flex-col print:w-full print:gap-6">
          {/* Left Panel: Accordions */}
          <div className="flex-3 min-w-[300px] space-y-3 print:w-full print:order-2">
            {/* Coparticipação Accordion */}
            <div className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-xs print:border-none print:shadow-none">
              <button 
                onClick={() => toggleAccordion("copart")}
                className="w-full p-4 flex justify-between items-center font-bold text-slate-800 hover:bg-slate-50 text-left text-sm no-print"
              >
                <span>{quotation.preferences.coparticipation ? "Com coparticipação" : "Sem coparticipação"}</span>
                {openAccordions.copart ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {/* Printed static title */}
              <h4 className="hidden print:block font-bold text-slate-950 text-sm p-4 pb-1 uppercase tracking-wider">
                {quotation.preferences.coparticipation ? "Com coparticipação" : "Sem coparticipação"}
              </h4>

              <div className={`p-4 pt-0 border-t border-slate-50 text-xs text-slate-500 leading-relaxed ${openAccordions.copart ? "block" : "hidden"} print:block print:border-none print:pt-2`}>
                {quotation.preferences.coparticipation 
                  ? "Possui custos adicionais reduzidos para a realização de consultas, exames simples, e procedimentos médicos eletivos."
                  : "Não possui custos adicionais para realização de consultas, exames, procedimentos ou internações corporativas."}
              </div>
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
              <div key={acc.id} className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-xs print:border-none print:shadow-none">
                <button 
                  onClick={() => toggleAccordion(acc.id)}
                  className="w-full p-4 flex justify-between items-center font-bold text-slate-800 hover:bg-slate-50 text-left text-sm no-print"
                >
                  <span>{acc.title}</span>
                  {openAccordions[acc.id] ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {/* Printed static title */}
                <h4 className="hidden print:block font-bold text-slate-950 text-sm p-4 pb-1 uppercase tracking-wider">
                  {acc.title}
                </h4>

                <div className={`p-4 pt-0 border-t border-slate-50 text-xs text-slate-500 leading-relaxed ${openAccordions[acc.id] ? "block" : "hidden"} print:block print:border-none print:pt-2`}>
                  {acc.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel: Pricing breakdown card */}
          <div className="flex-1 min-w-[280px] space-y-4 print:w-full print:order-1">
            <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs print:border-none print:shadow-none">
              <h3 className="font-bold text-slate-900 text-sm mb-1">{selectedPlan.operatorName}</h3>
              <input 
                type="text" 
                placeholder="Adicione um comentário..." 
                className="w-full mt-2 mb-4 p-2 text-xs border border-slate-100 rounded-md focus:outline-hidden focus:border-teal-500 bg-slate-50/50 no-print"
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
                className="w-full bg-[#25d366] text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-colors cursor-pointer shadow-xs no-print"
              >
                <FaWhatsapp className="text-lg" /> Tenho interesse
              </button>
            </div>

            {/* Hospital coverage preview cards */}
            <div 
              onClick={() => setIsHospitalsOpen(true)}
              className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs flex justify-between items-center cursor-pointer hover:border-slate-200 transition-colors print:hidden"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-xs">40 Hospitais</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Confira os principais hospitais da rede.</p>
              </div>
              <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <FiPlus />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs flex justify-between items-center print:hidden">
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

        {/* Render Hospitals Modal Overlay */}
        {renderHospitalsModal()}
      </div>
    );
  }

  // Hospitals Accreditations list modal layout renderer
  function renderHospitalsModal() {
    if (!isHospitalsOpen) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn no-print">
        <div className="bg-white rounded-2xl p-6 w-full max-w-[650px] shadow-2xl relative border border-slate-100 flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setIsHospitalsOpen(false)}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-950 font-bold text-sm bg-transparent border-none cursor-pointer"
            >
              <FiArrowLeft className="text-base" />
              <span>Rede credenciada</span>
            </button>
            
            <div className="w-[180px]">
              <input 
                type="text"
                placeholder="Procurar..."
                value={hospitalsSearch}
                onChange={(e) => setHospitalsSearch(e.target.value)}
                className="w-full py-1 px-3 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-teal-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Selected Plan Details */}
          <div className="flex flex-col items-center justify-center py-4 border-b border-slate-100 mb-4">
            <div className="h-14 w-14 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center font-extrabold text-xl border border-amber-500/20 shadow-xs mb-2">
              {selectedPlan ? selectedPlan.operatorName.substring(0, 2).toUpperCase() : "OP"}
            </div>
            <h4 className="font-extrabold text-slate-950 text-base">{selectedPlan ? selectedPlan.operatorName : "Plano Selecionado"}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Enfermaria</span>
          </div>

          {/* Scrollable Accreditations List */}
          <div className="overflow-y-auto flex-1 space-y-6 pr-2">
            {filteredHospitals.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">Nenhum hospital encontrado para a sua busca.</div>
            ) : (
              filteredHospitals.map(group => (
                <div key={group.region}>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                    <FiMapPin className="text-teal-600 text-sm" />
                    <span>{group.region}</span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map(item => (
                      <div key={item.name} className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{item.name}</div>
                          <div className="text-slate-400 mt-0.5">{item.sub}</div>
                        </div>
                        <span className="bg-white border border-slate-100 text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded-sm">{item.type}</span>
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
            <FiPrinter className="mr-1" /> Imprimir Comparativo
          </Button>
          <Button variant="secondary" onClick={() => setIsHospitalsOpen(true)}>
            Ver hospitais
          </Button>
          <Button onClick={() => setIsShareOpen(true)} className="flex items-center gap-1.5">
            <FiSend /> Enviar
          </Button>
          
          <div className="relative">
            <IconButton 
              type="button" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`border-slate-200 transition-colors ${isMenuOpen ? "bg-slate-50 border-slate-300" : ""}`}
              title="Mais Opções"
            >
              <FiMoreVertical />
            </IconButton>

            {/* Three dots option dropdown menu */}
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-[180px] bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1.5 animate-fadeIn">
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsShareOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <FiShare2 className="text-sm text-slate-400" />
                    Compartilhar
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.print();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <FiPrinter className="text-sm text-slate-400" />
                    Imprimir
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      alert("Filtros do cotador ativados.");
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <FiSliders className="text-sm text-slate-400" />
                    Opções
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      alert("Cotação duplicada com sucesso!");
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <FiCopy className="text-sm text-slate-400" />
                    Duplicar
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onDelete) onDelete();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <FiTrash2 className="text-sm text-red-500" />
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid Comparison Layout */}
      <div id="print-target" className="flex gap-6 items-start flex-wrap print:flex-col print:w-full print:gap-6">
        {/* Left column: Plan Cards Grid */}
        <div className="flex-3 min-w-[300px] grid grid-cols-1 md:grid-cols-2 gap-4 print:w-full print:grid-cols-1">
          {displayedResults.map((opResult: OperatorResult) => (
            <div key={opResult.operatorId} className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 hover:shadow-sm transition-all duration-200 print:shadow-none print:border-none print:p-0 print:mb-6">
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
                className="w-full text-xs py-2 normal-case font-bold no-print"
                onClick={() => setSelectedPlan(opResult)}
              >
                Ver detalhes
              </Button>
            </div>
          ))}
        </div>

        {/* Right column: Technical Summary Sidebar */}
        <div className="flex-1 min-w-[280px] bg-white border border-slate-100 rounded-lg p-5 shadow-xs space-y-4 print:w-full print:border-none print:shadow-none print:p-0">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Distribuição</span>
            <div className="text-lg font-bold text-slate-800 mt-1">Geral</div>
            <div className="text-xs text-slate-500 mt-0.5">{results.totalLives} {results.totalLives === 1 ? "vida" : "vidas"} cadastrada(s)</div>
          </div>

          <div className="border-t border-slate-50 pt-4 print:border-none">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">CNPJ / CPF</span>
            <div className="text-sm font-semibold text-slate-800 mt-1">
              {quotation.mode === "PME" ? "Informado (PME)" : "Não informado"}
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4 flex items-center gap-2.5 text-xs text-slate-500 print:hidden">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <div>
              <span>Criada por <strong className="font-semibold text-slate-700">{quotation.brokerName}</strong></span>
              <p className="text-[10px] text-slate-400 mt-0.5">há alguns instantes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn no-print">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[450px] shadow-2xl relative border border-slate-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Compartilhar</h3>
              <div className="flex items-center gap-2">
                <button className="text-slate-400 hover:text-slate-600 p-1 bg-transparent border-none cursor-pointer">
                  <FiSliders className="text-sm" />
                </button>
                <button 
                  onClick={() => setIsShareOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 bg-transparent border-none cursor-pointer"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Share Options Row */}
            <div className="flex justify-around items-center mb-6">
              <button 
                onClick={() => window.open(`https://api.whatsapp.com/send?text=Confira%20sua%20proposta%20de%20plano%20de%20saúde:%20https://app.cotaco.es/c/${quotation.id}`)}
                className="flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent"
              >
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#25d366] group-hover:text-white transition-all shadow-xs">
                  <FaWhatsapp className="text-2xl" />
                </div>
                <span className="text-xs text-slate-500 font-medium">WhatsApp</span>
              </button>

              <button 
                onClick={() => window.open(`mailto:?subject=Proposta%20de%20Plano%20de%20Saúde&body=Confira%20sua%20proposta:%20https://app.cotaco.es/c/${quotation.id}`)}
                className="flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent"
              >
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                  <FiMail className="text-2xl" />
                </div>
                <span className="text-xs text-slate-500 font-medium">E-mail</span>
              </button>

              <button 
                onClick={() => {
                  setIsShareOpen(false);
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

            {/* Copy Link Input */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={`https://app.cotaco.es/c/${quotation.id}`}
                className="flex-1 bg-transparent text-xs text-slate-600 px-2 focus:outline-hidden"
              />
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://app.cotaco.es/c/${quotation.id}`);
                  alert("Link copiado com sucesso!");
                }}
                className="text-xs py-1.5 px-4 rounded-md"
              >
                Copiar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Render Hospitals Modal Overlay */}
      {renderHospitalsModal()}
    </div>
  );
}
