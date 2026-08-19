import React from "react";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin-custom"></div>
    </div>
  );
}
