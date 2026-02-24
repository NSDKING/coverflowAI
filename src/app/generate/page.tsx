'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, Sparkles, Loader2, Languages, Image as ImageIcon, 
  ArrowRight, ChevronLeft, RotateCcw, Layout, PlusCircle
} from "lucide-react";
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

  const updateCVData = (newData: CVData) => setCvData(newData);

  // --- NEW: LOGIC FOR ADDING SECTIONS ---
  const addExperience = () => {
    if (!cvData) return;
    const newExp = {
      role: "Nouveau poste",
      company: "Entreprise",
      duration: "2024 - Présent",
      location: "",
      description: ["Nouvelle mission..."]
    };
    updateCVData({ ...cvData, experiences: [newExp, ...cvData.experiences] });
  };

  const addEducation = () => {
    if (!cvData) return;
    const newEdu = {
      degree: "Nouveau diplôme",
      school: "École / Université",
      year: "2024",
      location: ""
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}`, 'apikey': ANON_KEY! },
        body: JSON.stringify({ resumeText: input, language }),
      });
      const data = await response.json();
      setCvData(data);
      setStep(2);
    } catch (error) {
      alert("Erreur de chargement.");
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}`, 'apikey': ANON_KEY! },
        body: JSON.stringify({ currentData: cvData, language }),
      });
      const optimizedData = await response.json();
      setCvData(optimizedData);
      setStep(3);
    } catch (error) {
      setStep(3);
    } finally {
      setStatus('idle');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && cvData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCVData({ ...cvData, personalInfo: { ...cvData.personalInfo, photo: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      {/* HEADER & NAVIGATION */}
      <div className="relative flex justify-center items-center h-12">
        {step > 1 && status === 'idle' && (
          <Button variant="ghost" onClick={handleBack} className="absolute left-0 text-slate-500 font-bold">
            <ChevronLeft size={20} className="mr-1" /> Retour
          </Button>
        )}
        <div className="flex gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <div className="min-h-[60vh]">
        {step === 1 && (
          <div className="max-w-xl mx-auto">
            <Card className="p-8 border-2 border-dashed rounded-[2.5rem] bg-white shadow-xl">
               <div className="flex justify-center mb-6">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-40 rounded-full font-bold">
                      <Languages size={16} className="mr-2"/> <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="French">Français</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               {status === 'parsing' ? (
                 <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto mb-4" />Analysant...</div>
               ) : (
                 <CVUploader onComplete={handleInitialUpload} />
               )}
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 text-center animate-in fade-in zoom-in-95">
            {status === 'optimizing' ? (
              <div className="py-40"><Loader2 className="animate-spin mx-auto h-12 w-12 text-blue-600" /></div>
            ) : (
              <>
                <h2 className="text-3xl font-black">Choisissez un style</h2>
                <TemplateSelector selectedId={selectedTemplate} onSelect={setSelectedTemplate} cvData={cvData} />
                <Button onClick={handleAIOptimize} size="lg" className="bg-blue-600 rounded-full px-12 h-14 font-bold shadow-xl">
                  Générer mon CV <ArrowRight className="ml-2" />
                </Button>
              </>
            )}
          </div>
        )}

        {step === 3 && cvData && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-10">
            {/* ENHANCED TOOLBAR WITH ADD BUTTONS */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/10 text-white">
              <Button onClick={() => setStep(2)} variant="ghost" className="text-xs">
                <Layout size={16} className="mr-1 text-blue-400" /> Style
              </Button>
              <div className="h-6 w-[1px] bg-white/20 mx-1" />
              
              <Button onClick={addExperience} variant="ghost" className="text-xs hover:text-blue-400">
                <PlusCircle size={16} className="mr-1" /> Expérience
              </Button>
              <Button onClick={addEducation} variant="ghost" className="text-xs hover:text-blue-400">
                <PlusCircle size={16} className="mr-1" /> Formation
              </Button>

              <div className="h-6 w-[1px] bg-white/20 mx-1" />

              <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              <label htmlFor="photo-upload" className="p-2 hover:bg-white/10 rounded-xl cursor-pointer">
                <ImageIcon size={18} />
              </label>

              <Button onClick={handleAIOptimize} variant="ghost" className="text-emerald-400 font-bold text-xs">
                <Sparkles size={16} className="mr-1" /> IA
              </Button>

              <div className="h-6 w-[1px] bg-white/20 mx-1" />

              <Button className="bg-blue-600 rounded-xl px-6 font-bold">
                <Download size={18} className="mr-2" /> PDF
              </Button>
            </div>

            <div className="w-full flex justify-center pb-32">
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