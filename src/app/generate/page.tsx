'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Layout, Edit3, Download, Sparkles, Loader2, Languages, Image as ImageIcon } from "lucide-react";
import CVUploader from "@/components/CVUploader";
import TemplateSelector from "@/components/TemplateSelector";
import CVRenderer from "@/components/CVRender";
import { CVData } from "@/utils/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function CVFactory() {
  const [step, setStep] = useState(1);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [language, setLanguage] = useState('French');
  const [status, setStatus] = useState<'idle' | 'parsing' | 'optimizing'>('idle');

  const handleInitialUpload = async (input: string) => {
    setStatus('parsing');
    try {
      // 1. Try to see if the input is already JSON
      const parsedData = JSON.parse(input);
      
      if (parsedData.personalInfo) {
        console.log("Data already structured, skipping AI parsing.");
        setCvData(parsedData);
        setStep(2); // Jump straight to template selection
        return;
      }
    } catch (error) {
      console.error(error);
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
      console.log("Données optimisées reçues de l'IA :", optimizedData);
      setCvData(optimizedData);
      setStep(3);
    } catch (error) {
      console.error(error);
      setStep(3);
    } finally {
      setStatus('idle');
    }
  };

  const updateCVData = (newData: CVData) => {
    setCvData(newData);
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
      {/* Stepper simplifié */}
      <div className="flex justify-center items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 w-12 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
        ))}
      </div>

      <div className="min-h-[60vh]">
        {step === 1 && (
          <div className="max-w-xl mx-auto space-y-6">
            <Card className="p-8 border-2 border-dashed rounded-[2.5rem] bg-white shadow-xl">
               <div className="flex justify-center mb-6">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-40 rounded-full border-slate-200 font-bold">
                      <Languages size={16} className="mr-2"/> <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="French">Français</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               {status === 'parsing' ? (
                 <div className="py-20 text-center space-y-4">
                   <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
                   <p className="font-bold">Extraction des données...</p>
                 </div>
               ) : (
                 <CVUploader onComplete={handleInitialUpload} />
               )}
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 text-center animate-in fade-in zoom-in-95">
            {status === 'optimizing' ? (
              <div className="py-40 space-y-6">
                <div className="relative inline-block">
                   <Loader2 className="h-20 w-20 text-blue-600 animate-spin" />
                   <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black">L'IA peaufine votre rédaction...</h2>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black">Choisissez un template</h2>
                <TemplateSelector 
                  selectedId={selectedTemplate} 
                  onSelect={(id) => { setSelectedTemplate(id); handleAIOptimize(); }}
                  cvData={cvData}
                />
              </>
            )}
          </div>
        )}

        {step === 3 && cvData && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            
            {/* BARRE D'OUTILS FLOTTANTE */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/10 text-white">
              <div className="px-4 border-r border-white/10 hidden md:block">
                 <p className="text-[10px] uppercase font-black text-blue-400">Édition directe</p>
                 <p className="text-xs font-medium text-slate-300">Double-cliquez sur le texte</p>
              </div>

              <input type="file" id="photo-float" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              <label htmlFor="photo-float" className="p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors" title="Changer la photo">
                <ImageIcon size={20} />
              </label>

              <Button onClick={() => handleAIOptimize()} variant="ghost" className="hover:bg-emerald-500/20 text-emerald-400 font-bold">
                <Sparkles size={18} className="mr-2" /> Ré-optimiser
              </Button>

              <div className="h-6 w-[1px] bg-white/10 mx-2" />

              <Button className="bg-blue-600 hover:bg-blue-500 rounded-xl px-6 font-bold shadow-lg shadow-blue-500/20">
                <Download size={18} className="mr-2" /> Exporter PDF
              </Button>
            </div>

            {/* LE CV EN PLEINE LARGEUR (Zone WYSIWYG) */}
            <div className="w-full flex justify-center pb-32">
              <div className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden border border-slate-200 bg-white">
                <CVRenderer 
                  data={cvData} 
                  templateId={selectedTemplate} 
                  onChange={updateCVData} // On passe la fonction de mise à jour
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}