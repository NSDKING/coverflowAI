'use client'

import { useState, Suspense } from "react";
import dynamic from 'next/dynamic';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, Sparkles, Loader2, Languages, Image as ImageIcon, 
  ArrowRight, ChevronLeft, Layout, PlusCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

// --- DYNAMIC IMPORTS (Fixes DOMMatrix and SSR errors) ---
const CVUploader = dynamic(() => import("@/components/CVUploader"), { ssr: false });
const TemplateSelector = dynamic(() => import("@/components/TemplateSelector"), { ssr: false });
const CVRenderer = dynamic(() => import("@/components/CVRender"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[1122px] w-[794px] bg-white shadow-lg border border-slate-100">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-400 font-medium italic">Préparation de l'aperçu...</p>
      </div>
    </div>
  )
});

import { CVData } from "@/utils/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function CVFactory() {
  const [step, setStep] = useState(1);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('prime-ats');
  const [language, setLanguage] = useState('French');
  const [status, setStatus] = useState<'idle' | 'parsing' | 'optimizing'>('idle');

  const updateCVData = (newData: CVData) => setCvData(newData);

  // --- LOGIC FOR ADDING SECTIONS ---
  const addExperience = () => {
    if (!cvData) return;
    const newExp = {
      role: "Nouveau poste",
      company: "Entreprise",
      duration: "2024 - Présent",
      location: "Ville, Pays",
      description: ["Nouvelle mission ou réalisation clé..."]
    };
    updateCVData({ ...cvData, experiences: [newExp, ...cvData.experiences] });
  };

  const addEducation = () => {
    if (!cvData) return;
    const newEdu = {
      degree: "Nouveau diplôme",
      school: "École / Université",
      year: "2024",
      location: "Ville, Pays"
    };
    updateCVData({ ...cvData, education: [...cvData.education, newEdu] });
  };

  const handleBack = () => {
    if (step === 2) { setStep(1); setCvData(null); }
    else if (step === 3) { setStep(2); }
  };
  
  const handleInitialUpload = async (input: any) => {
    setStatus('parsing');
    try {
      if (typeof input === 'object' && input !== null) {
        setCvData(input);
        setStep(2);
        return;
      }
      const response = await fetch(`${SUPABASE_URL}/functions/v1/process-cv-data`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${ANON_KEY}`, 
          'apikey': ANON_KEY! 
        },
        body: JSON.stringify({ resumeText: input, language }),
      });
      const data = await response.json();
      setCvData(data);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'analyse du document.");
    } finally {
      setStatus('idle');
    }
  };

  const handleAIOptimize = async () => {
    if (!cvData) return;
    setStatus('optimizing');
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-cv`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${ANON_KEY}`, 
          'apikey': ANON_KEY! 
        },
        body: JSON.stringify({ currentData: cvData, language }),
      });
      const optimizedData = await response.json();
      setCvData(optimizedData);
      setStep(3);
    } catch (error) {
      console.error(error);
      setStep(3); // Go to edit mode anyway if AI fails
    } finally {
      setStatus('idle');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && cvData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCVData({ 
          ...cvData, 
          personalInfo: { ...cvData.personalInfo, photo: reader.result as string } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      {/* STEP INDICATOR */}
      <div className="relative flex justify-center items-center h-12">
        {step > 1 && status === 'idle' && (
          <Button variant="ghost" onClick={handleBack} className="absolute left-0 text-slate-500 font-bold hover:bg-slate-100 rounded-full">
            <ChevronLeft size={20} className="mr-1" /> Retour
          </Button>
        )}
        <div className="flex gap-4">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-2.5 w-16 rounded-full transition-all duration-700 ease-in-out ${
                step >= s ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-200'
              }`} 
            />
          ))}
        </div>
      </div>

      <div className="min-h-[60vh]">
        {/* STEP 1: UPLOAD */}
        {step === 1 && (
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-8 border-2 border-dashed rounded-[2.5rem] bg-white shadow-2xl border-slate-200">
               <div className="flex justify-center mb-8">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-44 rounded-full font-bold border-slate-200 shadow-sm">
                      <Languages size={16} className="mr-2 text-blue-600"/> <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="French">🇫🇷 Français</SelectItem>
                      <SelectItem value="English">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               {status === 'parsing' ? (
                 <div className="py-20 text-center">
                   <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
                   <p className="text-lg font-bold text-slate-700">Analyse de votre CV...</p>
                   <p className="text-sm text-slate-400">Extraction des données en cours</p>
                 </div>
               ) : (
                 <Suspense fallback={<div className="h-64 flex items-center justify-center">Chargement...</div>}>
                    <CVUploader onComplete={handleInitialUpload} />
                 </Suspense>
               )}
            </Card>
          </div>
        )}

        {/* STEP 2: TEMPLATE SELECTION */}
        {step === 2 && (
          <div className="space-y-10 text-center animate-in fade-in zoom-in-95 duration-500">
            {status === 'optimizing' ? (
              <div className="py-40 flex flex-col items-center">
                <Loader2 className="animate-spin h-16 w-16 text-blue-600 mb-6" />
                <h2 className="text-2xl font-black text-slate-800">Optimisation par IA</h2>
                <p className="text-slate-500 italic">Nous mettons en valeur vos compétences...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight">Choisissez un design</h2>
                    <p className="text-slate-500">Sélectionnez le template qui correspond à votre secteur.</p>
                </div>
                <Suspense fallback={<div className="h-96 w-full bg-slate-100 animate-pulse rounded-3xl" />}>
                    <TemplateSelector selectedId={selectedTemplate} onSelect={setSelectedTemplate} cvData={cvData} />
                </Suspense>
                <div className="pt-6">
                    <Button onClick={handleAIOptimize} size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full px-16 h-16 text-lg font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95">
                    Générer mon CV <ArrowRight className="ml-3" />
                    </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 3: EDITOR */}
        {step === 3 && cvData && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* FLOATING ACTION TOOLBAR */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-2xl p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 text-white transition-all hover:scale-105">
              <Button onClick={() => setStep(2)} variant="ghost" className="text-xs font-bold hover:bg-white/10">
                <Layout size={18} className="mr-2 text-blue-400" /> Styles
              </Button>
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              
              <Button onClick={addExperience} variant="ghost" className="text-xs font-bold hover:text-blue-400 hover:bg-white/10">
                <PlusCircle size={18} className="mr-2" /> Poste
              </Button>
              <Button onClick={addEducation} variant="ghost" className="text-xs font-bold hover:text-blue-400 hover:bg-white/10">
                <PlusCircle size={18} className="mr-2" /> Diplôme
              </Button>

              <div className="h-8 w-[1px] bg-white/10 mx-2" />

              <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              <label htmlFor="photo-upload" className="p-2.5 hover:bg-white/10 rounded-2xl cursor-pointer transition-colors" title="Ajouter une photo">
                <ImageIcon size={20} className="text-slate-300" />
              </label>

              <Button onClick={handleAIOptimize} variant="ghost" className="text-emerald-400 font-bold text-xs hover:bg-emerald-500/10">
                <Sparkles size={18} className="mr-2" /> Magie IA
              </Button>

              <div className="h-8 w-[1px] bg-white/10 mx-2" />

              <Button className="bg-blue-600 hover:bg-blue-500 rounded-2xl px-8 h-11 font-bold shadow-lg">
                <Download size={18} className="mr-2" /> Télécharger PDF
              </Button>
            </div>

            <div className="w-full flex justify-center pb-40">
              <CVRenderer 
                data={cvData} 
                templateId={selectedTemplate} 
                onChange={updateCVData} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}