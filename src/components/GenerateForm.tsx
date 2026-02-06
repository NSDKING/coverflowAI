'use client'

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, FileUp, FileText, X, Copy, Check } from "lucide-react";
import mammoth from "mammoth";

export default function GeneratorForm() {
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescText, setJobDescText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // --- Logique d'extraction PDF (Import dynamique pour éviter DOMMatrix error) ---
const parsePdf = async (file: File): Promise<string> => {
    // 1. Import dynamique de la lib principale
    const pdfjsLib = await import("pdfjs-dist");

    // 2. Import dynamique du worker local (plus fiable que le CDN)
    // @ts-ignore - On ignore l'erreur de type pour l'import du worker
    await import("pdfjs-dist/build/pdf.worker.mjs");

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text;
  };

  // --- Logique d'extraction Word (.docx) ---
  const parseDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParsing(true);
    
    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await parsePdf(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        text = await parseDocx(file);
      } else {
        alert("Format non supporté (PDF ou DOCX uniquement)");
        setFileName(null);
        return;
      }
      setResumeText(text);
    } catch (error) {
      console.error("Erreur parsing:", error);
      alert("Erreur lors de la lecture du fichier.");
      setFileName(null);
    } finally {
      setParsing(false);
    }
  };

  const handleGenerate = async () => {
    if (!resumeText || !jobDescText) {
      alert("Veuillez fournir votre CV et la description du poste.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-letter', {
        body: { 
          resume: resumeText, 
          jobDescription: jobDescText 
        },
      });

      if (error) throw error;
      setResult(data.content);
    } catch (err) {
      console.error("Erreur génération:", err);
      alert("L'IA n'a pas pu répondre. Vérifiez votre clé API OpenAI.");
    } finally {
      setLoading(false);
    }
  };

const copyToClipboard = async () => {
    if (!result) return;

    try {
      // Tentative avec l'API moderne
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(result);
        setCopied(true);
      } else {
        // Méthode de secours (Fallback) pour les contextes non sécurisés
        const textArea = document.createElement("textarea");
        textArea.value = result;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
        } catch (err) {
          console.error('Fallback: Impossible de copier', err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Erreur lors de la copie :', err);
    } finally {
      if (copied || true) { // On force l'état visuel pour le feedback
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <Card className="p-8 shadow-2xl border-slate-100 bg-white/90 backdrop-blur-md rounded-[2.5rem]">
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* CÔTÉ GAUCHE : UPLOAD CV */}
          <div className="flex flex-col space-y-4">
            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">
              Étape 1 : Ton CV
            </label>
            
            {!fileName ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-12 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group min-h-[300px]"
              >
                <div className="bg-blue-100 p-5 rounded-full group-hover:scale-110 transition-transform shadow-inner">
                  <FileUp className="h-10 w-10 text-blue-600" />
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-600">Dépose ton CV ici</p>
                <p className="text-xs text-slate-400 mt-2">PDF ou DOCX acceptés</p>
              </div>
            ) : (
              <div className="flex-1 border border-blue-100 bg-blue-50/30 rounded-[2rem] p-8 flex flex-col items-center justify-center relative min-h-[300px]">
                <button 
                  onClick={() => { setFileName(null); setResumeText(""); }}
                  className="absolute top-6 right-6 p-2 hover:bg-red-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
                <FileText className="h-16 w-16 text-blue-500 mb-4" />
                <p className="text-sm font-bold text-slate-800 text-center max-w-[200px] truncate">
                  {fileName}
                </p>
                {parsing && (
                  <div className="flex items-center gap-2 mt-4 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs font-bold animate-pulse">Extraction...</span>
                  </div>
                )}
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf,.docx" 
            />
          </div>

          {/* CÔTÉ DROIT : DESCRIPTION POSTE */}
          <div className="flex flex-col space-y-4">
            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">
              Étape 2 : L'annonce
            </label>
            <Textarea 
              placeholder="Colle la description du poste ici pour que l'IA adapte ton CV..." 
              value={jobDescText} 
              onChange={(e) => setJobDescText(e.target.value)}
              className="flex-1 min-h-[300px] rounded-[2rem] border-slate-200 resize-none focus:ring-blue-500 p-8 shadow-inner bg-slate-50/50"
            />
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading || parsing || !resumeText} 
          className="w-full mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-20 rounded-[1.5rem] text-2xl font-black shadow-2xl shadow-blue-200 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <><Loader2 className="mr-3 h-8 w-8 animate-spin" /> Analyse en cours...</>
          ) : (
            <><Sparkles className="mr-3 h-8 w-8" /> Générer la lettre magique</>
          )}
        </Button>
      </Card>

      {/* RÉSULTAT */}
      {result && (
        <Card className="p-12 bg-white border-blue-100 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] relative group animate-in fade-in slide-in-from-bottom-10 duration-700">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-8 right-8 gap-2 rounded-full border-slate-200 text-slate-500 hover:text-blue-600"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copié !" : "Copier"}
            </Button>
            
            <div className="prose prose-blue max-w-none">
              <div className="whitespace-pre-wrap font-serif text-xl leading-relaxed text-slate-800">
                {result}
              </div>
            </div>
        </Card>
      )}
    </div>
  );
}