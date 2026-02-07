"use client"; // Indispensable ici

import dynamic from "next/dynamic";

const GeneratorForm = dynamic(() => import("@/components/GenerateForm"), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-slate-500 font-medium">Chargement du générateur sécurisé...</p>
      </div>
    </div>
  )
});

export default function ClientGenerator() {
  return <GeneratorForm />;
}