"use client";

import dynamic from "next/dynamic";

const GeneratorForm = dynamic(() => import("@/components/GenerateForm"), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
       <p className="text-slate-500 animate-pulse">Initialisation du générateur...</p>
    </div>
  )
});

export default function ClientGenerator() {
  return <GeneratorForm />;
}