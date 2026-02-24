'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Sparkles, 
  Loader2, 
  Languages, 
  Image as ImageIcon, 
  ArrowRight, 
  ChevronLeft, 
  RotateCcw,
  Layout
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

  // --- LOGIC: NAVIGATION ---
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setCvData(null); // Reset data to allow a clean new upload
    } else if (step === 3) {
      setStep(2);
    }
  };

  // --- LOGIC: STEP 1 (UPLOAD & PARSE) ---
  const handleInitialUpload = async (input: any) => {
    setStatus('parsing');
    try {
      // 1. Check if input is already an Object (fixes the [object Object] error)
      if (typeof input === 'object' && input !== null) {
        console.log("Structured object detected.");
        setCvData(input);
        setStep(2);
        return;
      }

      // 2. Check if input is a JSON string
      try {
        const parsedData = JSON.parse(input);
        if (parsedData.personalInfo) {
          setCvData(parsedData);
          setStep(2);
          return;
        }
      } catch (e) {
        console.log("Input is raw text, calling Edge Function...");
      }

      // 3. Fallback to AI Parsing
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
      console.error("Upload Error:", error);
      alert("Erreur lors de la lecture du fichier.");
    } finally {
      setStatus('idle');
    }
  };

  // --- LOGIC: STEP 2 -> 3 (OPTIMIZE) ---
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
      console.error("Optimization failed:", error);
      setStep(3); // Proceed with current data even if AI fails
    } finally {
      setStatus('idle');
    }
  };

  const updateCVData = (newData: CVData) => setCvData(newData);

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
      
      {/* HEADER & NAVIGATION */}
      <div className="relative flex justify-center items-center mb-8 h-12">
        {step > 1 && status === 'idle' && (
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="absolute left-0 text-slate-500 hover:text-blue-600 font-bold"
          >
            <ChevronLeft size={20} className="mr-1" /> 
            {step === 2 ? "Changer de fichier" : "Retour"}
          </Button>
        )}

        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} 
            />
          ))}
        </div>
      </div>

      <div className="min-h-[60vh]">
        {/* STEP 1: UPLOAD */}
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

        {/* STEP 2: TEMPLATE SELECTION */}
        {step === 2 && (
          <div className="space-y-8 text-center animate-in fade-in zoom-in-95">
            {status === 'optimizing' ? (
              <div className="py-40 space-y-6">
                <div className="relative inline-block">
                   <Loader2 className="h-20 w-20 text-blue-600 animate-spin" />
                   <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black italic text-slate-700">L'IA améliore votre rédaction...</h2>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-slate-900">Choisissez un style</h2>
                <TemplateSelector 
                  selectedId={selectedTemplate} 
                  onSelect={setSelectedTemplate}
                  cvData={cvData}
                />
                <div className="flex justify-center gap-4 pt-8">
                    <Button variant="outline" onClick={() => {setStep(1); setCvData(null);}} className="rounded-full px-8 border-slate-200">
                        <RotateCcw size={18} className="mr-2" /> Recommencer
                    </Button>
                    <Button onClick={handleAIOptimize} size="lg" className="bg-blue-600 hover:bg-blue-700 px-10 rounded-full h-14 text-lg font-bold shadow-xl">
                        Valider ce style <ArrowRight className="ml-2" />
                    </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 3: PREVIEW & EDIT */}
        {step === 3 && cvData && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            
            {/* FLOATING TOOLBAR */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/10 text-white">
              <Button onClick={() => setStep(2)} variant="ghost" className="hover:bg-white/10 rounded-xl">
                <Layout size={18} className="mr-2 text-blue-400" /> Style
              </Button>
              
              <div className="h-6 w-[1px] bg-white/20 mx-1" />

              <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              <label htmlFor="photo-upload" className="p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors">
                <ImageIcon size={20} />
              </label>

              <Button onClick={handleAIOptimize} variant="ghost" className="hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-xl">
                <Sparkles size={18} className="mr-2" /> Ré-optimiser
              </Button>

              <div className="h-6 w-[1px] bg-white/20 mx-1" />

              <Button className="bg-blue-600 hover:bg-blue-500 rounded-xl px-6 font-bold shadow-lg shadow-blue-500/20">
                <Download size={18} className="mr-2" /> PDF
              </Button>
            </div>

            {/* RENDERER */}
            <div className="w-full flex justify-center pb-32">
              <div className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden border border-slate-200 bg-white">
                <CVRenderer 
                  data={cvData} 
                  templateId={selectedTemplate} 
                  onChange={updateCVData} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}