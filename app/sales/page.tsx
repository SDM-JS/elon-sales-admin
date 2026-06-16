"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SalesPageContent } from "@/components/sales/sales-content";

export default function SalesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            Загрузка страницы...
          </p>
        </div>
      }
    >
      <SalesPageContent />
    </Suspense>
  );
}
