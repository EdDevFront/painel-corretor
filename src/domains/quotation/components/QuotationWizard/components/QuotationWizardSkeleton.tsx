import React from "react";

export function QuotationWizardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-3 w-16 bg-slate-100 rounded" />
        <div className="h-3 w-2 bg-slate-100 rounded" />
        <div className="h-3 w-24 bg-slate-100 rounded" />
      </div>
      
      {/* Header row: title + action buttons */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-100 rounded-lg" />
          <div className="h-3 w-48 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-36 bg-slate-100 rounded-lg" />
          <div className="h-9 w-28 bg-slate-100 rounded-lg" />
          <div className="h-9 w-20 bg-slate-100 rounded-lg" />
          <div className="h-9 w-9 bg-slate-100 rounded-lg" />
        </div>
      </div>
      
      {/* Grid: plan cards + sidebar */}
      <div className="flex gap-6 items-start">
        <div className="flex-3 min-w-[300px] grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 space-y-4">
              <div className="h-10 w-10 bg-slate-100 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-100 rounded" />
                <div className="h-3 w-24 bg-slate-100 rounded" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-20 bg-slate-50 rounded" />
                  <div className="h-5 w-16 bg-slate-50 rounded" />
                </div>
              </div>
              <div className="border-t border-slate-50 pt-4 space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-8 w-36 bg-slate-100 rounded" />
              </div>
              <div className="h-9 w-full bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
        
        <div className="flex-1 min-w-[260px] bg-slate-50 border border-slate-100 rounded-xl p-6 space-y-5">
          <div className="space-y-2">
            <div className="h-2 w-16 bg-slate-100 rounded" />
            <div className="h-5 w-12 bg-slate-100 rounded" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="h-2 w-16 bg-slate-100 rounded" />
            <div className="h-5 w-32 bg-slate-100 rounded" />
          </div>
          <div className="border-t border-slate-100 pt-4 flex gap-3 items-center">
            <div className="h-3 w-3 bg-slate-100 rounded-full" />
            <div className="space-y-1">
              <div className="h-3 w-32 bg-slate-100 rounded" />
              <div className="h-2 w-24 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}