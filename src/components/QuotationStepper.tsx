import React from "react";

interface StepperProps {
  currentStep: number;
}

const STEPS = [
  "Identificação",
  "Configuração",
  "Vidas",
  "Preferências",
  "Resultados",
];

export function QuotationStepper({ currentStep }: StepperProps) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: "2.5rem",
      padding: "0.5rem 0",
      position: "relative",
    }}>
      {STEPS.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        
        return (
          <div key={step} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            zIndex: 2,
          }}>
            <div style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "50%",
              backgroundColor: isActive ? "var(--teal-600)" : isCompleted ? "var(--slate-900)" : "var(--slate-100)",
              color: isActive || isCompleted ? "#ffffff" : "var(--slate-500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: isActive ? "4px solid var(--teal-100)" : "none",
              transition: "all 0.3s ease",
            }}>
              {stepNum}
            </div>
            <span style={{
              fontSize: "0.75rem",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "var(--slate-900)" : "var(--slate-400)",
              marginTop: "0.5rem",
              textAlign: "center",
            }}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
