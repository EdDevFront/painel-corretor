import React from "react";
import { Skeleton } from "./Skeleton";

export function TableSkeleton() {
  const skeletonRows = Array(3).fill(null);

  return (
    <div className="w-full">
      {/* Table Mockup */}
      <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-xs">
        {/* Table Header Mock */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-4 gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12 ml-auto" />
        </div>
        
        {/* Table Rows Mock */}
        <div className="flex flex-col">
          {skeletonRows.map((_, i) => (
            <div key={i} className="flex border-b border-slate-100 p-4 gap-4 items-center">
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
