'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Layout, Edit3, Download } from "lucide-react";
import CVUploader from "@/components/CVUploader";
import TemplateSelector from "@/components/TemplateSelector";
import CVEditor from "@/components/CVEditor";
import { CVData } from "@/utils/types";
import CVRenderer from "@/components/CVRender";
 
export default function CVFactory() {
  const [step, setStep] = useState(1);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFinishUpload = (data: CVData) => {
    setCvData(data);
    setStep(2);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
      {/* STEPPER */}
      <div className="flex justify-center items-center gap-6 mb-12">
        <StepIcon active={step >= 1} icon={<FileUp size={20}/>} label="Upload" />
        <div className={`h-1 w-16 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <StepIcon active={step >= 2} icon={<Layout size={20}/>} label="Design" />
        <div className={`h-1 w-16 rounded ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <StepIcon active={step >= 3} icon={<Edit3 size={20}/>} label="Édition" />
      </div>

      <div className="min-h-[60vh]">
        {step === 1 && (
          <Card className="p-16 border-dashed border-4 rounded-[3rem] text-center bg-slate-50/50">
            <CVUploader onComplete={handleFinishUpload} />
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-3xl font-black text-center text-slate-900">Choisissez votre style</h2>
            <TemplateSelector 
              selectedId={selectedTemplate} 
              onSelect={(id) => { setSelectedTemplate(id); setStep(3); }}
              cvData={cvData}
            />
          </div>
        )}

        {step === 3 && cvData && (
          <div className="grid lg:grid-cols-2 gap-10 items-start animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Dans le panneau de gauche de l'étape 3 */}
            <div className="mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-blue-200 overflow-hidden flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} className="w-full h-full object-cover" />
                  ) : (
                    <Layout className="text-blue-300" />
                  )}
                </div>
                <input 
                  type="file" 
                  id="photo-upload" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">Ajouter une photo ?</h4>
                <p className="text-xs text-slate-500 mb-3">Certains templates pro sont plus élégants avec une photo.</p>
                <Button variant="outline" size="sm" asChild className="cursor-pointer bg-white">
                  <label htmlFor="photo-upload">Choisir une image</label>
                </Button>
              </div>
            </div>
            {/* PANNEAU GAUCHE : ÉDITION */}
            <div className="bg-white rounded-3xl shadow-xl border p-2 overflow-hidden">
              <CVEditor data={cvData} onChange={setCvData} />
            </div>

            {/* PANNEAU DROITE : APERÇU FIXE */}
            <div className="sticky top-10 space-y-4">
              <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl shadow-2xl text-white">
                <span className="text-sm font-bold uppercase tracking-widest text-blue-400">Aperçu Réel</span>
                <Button className="bg-blue-600 hover:bg-blue-500 rounded-full px-6">
                  <Download size={18} className="mr-2" /> Exporter PDF
                </Button>
              </div>

              {/* ZONE DE RENDU AVEC LE SCALE MAGIQUE */}
              <div className="bg-slate-200 rounded-[2rem] border-4 border-white shadow-inner flex justify-center overflow-hidden h-[750px] relative">
                <div className="absolute top-0 origin-top transform transition-all duration-500 ease-out py-10" 
                     style={{ transform: 'scale(0.55)' }}>
                  <CVRenderer 
                    data={cvData} 
                    templateId={selectedTemplate} 
                    profileImage={cvData.personalInfo.photo} 
                  />
                </div>
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
    <div className={`flex flex-col items-center gap-3 ${active ? 'text-blue-600' : 'text-slate-400'}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-xl rotate-0' : 'bg-slate-100 rotate-3'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}