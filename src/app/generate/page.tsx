'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Layout, Edit3, Download, Sparkles } from "lucide-react";
import CVUploader from "@/components/CVUploader";
import TemplateSelector from "@/components/TemplateSelector";
import CVEditor from "@/components/CVEditor";
import ModernTemplate from "@/components/ModernTemplate";
 

export default function CVFactory() {
  const [step, setStep] = useState(1); // 1: Upload, 2: Template, 3: Edit
  const [cvData, setCvData] = useState(null); // JSON extrait par l'IA
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const handleFinishUpload = (data: any) => {
    setCvData(data);
    setStep(2);
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    setStep(3);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      {/* STEPPER UI */}
      <div className="flex justify-center items-center gap-4 mb-12">
        <StepIcon active={step >= 1} icon={<FileUp size={20}/>} label="Upload" />
        <div className={`h-1 w-12 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <StepIcon active={step >= 2} icon={<Layout size={20}/>} label="Template" />
        <div className={`h-1 w-12 rounded ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <StepIcon active={step >= 3} icon={<Edit3 size={20}/>} label="Édition" />
      </div>

      {/* RENDER DYNAMIQUE DES ÉTAPES */}
      <div className="transition-all duration-500">
        {step === 1 && (
          <Card className="p-12 border-dashed border-2 rounded-[3rem] text-center">
            <CVUploader onComplete={handleFinishUpload} />
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Choisissez un style</h2>
            <TemplateSelector onSelect={handleSelectTemplate} />
          </div>
        )}

        {step === 3 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulaire de modification à gauche */}
            <CVEditor data={cvData} onChange={setCvData} />
            
            {/* Aperçu Temps Réel à droite */}
            <div className="sticky top-24">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold">Aperçu du rendu</h3>
                 <Button className="bg-green-600 hover:bg-green-700 gap-2">
                   <Download size={18} /> Télécharger PDF
                 </Button>
               </div>
               <div className="scale-[0.6] origin-top border shadow-2xl rounded-lg overflow-hidden">
                 {/* Ton ModernTemplate créé précédemment */}
                 <ModernTemplate data={cvData} />
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIcon({ active, icon, label }: { active: boolean, icon: any, label: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${active ? 'text-blue-600' : 'text-slate-400'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100'}`}>
        {icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}