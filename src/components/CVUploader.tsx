import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, FileUp, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function CVUploader({ onComplete }: { onComplete: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // 1. Ici tu extrais le texte (via ta fonction PDF existante)
      // 2. Tu appelles ton Edge Function "process-cv-data"
      const { data, error } = await supabase.functions.invoke("process-cv-data", {
        body: { resumeText: "Texte extrait du PDF..." } // Remplace par le vrai texte
      });

      if (error) throw error;
      onComplete(data); // Envoie le JSON au parent (CVFactory)
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'analyse du CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
        {loading ? <Loader2 className="animate-spin" size={40} /> : <FileUp size={40} />}
      </div>
      <h3 className="text-2xl font-bold">Importez votre CV actuel</h3>
      <p className="text-slate-500 max-w-sm">
        PDF ou DOCX. Notre IA va extraire vos données pour les adapter au nouveau design.
      </p>
      <input type="file" id="cv-upload" className="hidden" onChange={handleUpload} accept=".pdf,.docx" />
      <Button asChild size="lg" className="rounded-full px-10 h-14 bg-blue-600">
        <label htmlFor="cv-upload" className="cursor-pointer">
          {loading ? "Analyse en cours..." : "Sélectionner un fichier"}
        </label>
      </Button>
    </div>
  );
}