import React from "react";

interface StepperProps {
  currentStep: number;
  isStepClickable: (step: number) => boolean;
  onStepClick: (step: number) => void;
}

const STEPS = [
  "Identificação",
  "Configuração",
  "Vidas",
  "Preferências",
  "Resultados",
];

export function QuotationStepper({ currentStep, isStepClickable, onStepClick }: StepperProps) {
  return (
    <div className="flex justify-between items-center w-full mb-10 py-2 relative">
      {STEPS.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const clickable = isStepClickable(stepNum);
        
        return (
          <div 
            key={step} 
            onClick={() => clickable && onStepClick(stepNum)}
            className={`flex flex-col items-center flex-1 z-10 ${
              clickable ? "cursor-pointer group" : "cursor-not-allowed"
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              isActive 
                ? "bg-teal-600 text-white border-4 border-teal-100" 
                : isCompleted 
                  ? "bg-slate-900 text-white group-hover:bg-slate-700" 
                  : "bg-slate-100 text-slate-500"
            }`}>
              {stepNum}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider mt-2 text-center transition-colors ${
              isActive ? "text-slate-900" : clickable ? "text-slate-500 group-hover:text-slate-700" : "text-slate-400"
            }`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
