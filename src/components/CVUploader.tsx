'use client'
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, FileUp } from "lucide-react";
import { Button } from "./ui/button";
import * as pdfjs from 'pdfjs-dist';

// Configuration du worker PDF.js (essentiel pour Next.js)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function CVUploader({ onComplete }: { onComplete: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // Pour informer l'utilisateur de l'étape
  const supabase = createClient();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    // Dans handleUpload juste après l'extraction
    if (fullText.length < 100) {
      alert("Ce PDF semble être une image scannée. Veuillez utiliser un PDF contenant du texte sélectionnable.");
      setLoading(false);
      return "";
    }
    return fullText;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Étape 1 : Lecture du PDF
      setStatus("Lecture du document...");
      const extractedText = await extractTextFromPDF(file);

      if (!extractedText.trim()) {
        throw new Error("Le PDF semble vide ou est une image scannée.");
      }

      // Étape 2 : Appel de l'IA via Edge Function
      setStatus("L'IA structure vos données...");
      const { data, error } = await supabase.functions.invoke("process-cv-data", {
        body: { resumeText: extractedText }
      });

      if (error) throw error;
      
      onComplete(data); 
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erreur lors de l'analyse du CV");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-4 transition-all duration-500 overflow-hidden relative">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin mb-2" size={32} />
            <span className="text-[10px] font-bold uppercase animate-pulse">AI</span>
          </div>
        ) : (
          <FileUp size={40} />
        )}
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black tracking-tight">Importez votre CV</h3>
        <p className="text-slate-500 text-sm max-w-[280px] mx-auto leading-relaxed">
          {status || "Notre IA va extraire vos données pour les adapter aux nouveaux designs."}
        </p>
      </div>

      <input 
        type="file" 
        id="cv-upload" 
        className="hidden" 
        onChange={handleUpload} 
        accept="application/pdf" // Pour l'instant on se concentre sur le PDF
      />
      
      <Button 
        asChild 
        disabled={loading}
        size="lg" 
        className="rounded-full px-12 h-14 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
      >
        <label htmlFor="cv-upload" className="cursor-pointer font-bold">
          {loading ? "Traitement..." : "Sélectionner un PDF"}
        </label>
      </Button>

      <p className="text-[10px] text-slate-400 font-medium">Fichiers supportés : PDF uniquement (pour le moment)</p>
    </div>
  );
}