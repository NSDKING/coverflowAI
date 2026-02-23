'use client'

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, FileUp, FileText, X, Copy, Check, Download } from "lucide-react";
import mammoth from "mammoth";
import jsPDF from "jspdf";

interface SupabaseUser {
  id: string;
}

interface UserCredits {
  id: string;
  credits: number;
}

interface GenerateLetterResponse {
  content: string;
}

interface StripeSessionResponse {
  url?: string;
}

interface InvokeOptions {
  body: Record<string, unknown>;
}

interface SupabaseRpcResponse {
  data: boolean | null;
  error: Error | null;
}

interface SupabaseInvokeResponse<T> {
  data: T | null;
  error: Error | null;
}

export default function GeneratorForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [parsing, setParsing] = useState<boolean>(false);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescText, setJobDescText] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const COST_PER_GENERATION: number = 5;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  
  // --- Improved PDF ---
  const downloadPDF = (): void => {
    if (!result) return;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - margin * 2;

    let y = 20;

  
    y += 10;

    // — BODY —
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(result, textWidth);
    doc.text(lines, margin, y);

    // — SAVE —
    const cleanName = fileName?.split(".")[0] || "CoverLetter";
    doc.save(`Lettre_Motivation_${cleanName}.pdf`);
  };

  // --- PDF parsing functions (unchanged) ---
  const parsePdf = async (file: File): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist");
    // @ts-ignore
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

  const parseDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
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
        alert("Format non supporté");
        setFileName(null);
        return;
      }
      setResumeText(text);
    } catch (error) {
      console.error(error);
      setFileName(null);
    } finally {
      setParsing(false);
    }
  };

  const handleGenerate = async (): Promise<void> => {
    if (!resumeText || !jobDescText) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Check & Deduct in one go via RPC
    const { data: canAfford, error: rpcError } = await supabase.rpc(
      "deduct_credits_if_available",
      { user_id: user.id, cost: COST_PER_GENERATION }
    );

    // 2. If the RPC returns false (or null), show the modal
    if (rpcError || !canAfford) {
      setShowPaymentModal(true);
      return;
    }

    // 3. If we are here, credits were deducted successfully. Start AI generation.
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<GenerateLetterResponse>("generate-letter", {
        body: { resume: resumeText, jobDescription: jobDescText },
      });

      if (error) throw error;
      setResult(data?.content ?? null);
      
      // Refresh local credits from DB to keep UI in sync
      setCredits(prev => (prev !== null ? prev - COST_PER_GENERATION : null));

    } catch (err) {
      console.error(err);
      alert("Erreur de génération. Contactez le support pour un remboursement.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

const handlePayment = async (bundleType: "starter" | "candidat" | "expert") => {
  setLoading(true);
  try {
    // Opt  ionnel : vérifier si la session existe avant l'appel
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Tu dois être connecté pour acheter des crédits.");
      return;
    }

    const { data, error } = await supabase.functions.invoke("create-stripe-session", {
      body: { bundleType }
    });

    if (error) throw error;
    if (data?.url) window.location.href = data.url;

  } catch (err) {
    console.error("Erreur complète:", err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    const fetchCredits = async (): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .single<UserCredits>();

      if (!error && data) {
        setCredits(data.credits);
      }
    };

    fetchCredits();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* FORM */}
      <Card className="p-8 shadow-2xl border-slate-100 bg-white/90 rounded-[2.5rem]">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Upload CV */}
          <div className="flex flex-col space-y-4">
            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">
              Étape 1 : Ton CV
            </label>
            {!fileName ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-blue-50 transition-all min-h-[300px]"
              >
                <FileUp className="h-10 w-10 text-blue-600" />
                <p className="mt-5 text-sm font-semibold">Dépose ton CV ici</p>
              </div>
            ) : (
              <div className="flex-1 border border-blue-100 bg-blue-50/30 rounded-[2rem] p-8 flex flex-col items-center justify-center relative min-h-[300px]">
                <button
                  onClick={() => {
                    setFileName(null);
                    setResumeText("");
                  }}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500"
                >
                  <X />
                </button>
                <FileText className="h-16 w-16 text-blue-500" />
                <p className="text-sm font-bold mt-2">{fileName}</p>
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

          {/* Job Description */}
          <div className="flex flex-col space-y-4">
            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wider">
              Étape 2 : L'annonce
            </label>
            <Textarea
              placeholder="Colle l'annonce..."
              value={jobDescText}
              onChange={(e) => setJobDescText(e.target.value)}
              className="flex-1 min-h-[300px] rounded-[2rem] p-8 bg-slate-50/50"
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || parsing || !resumeText}
          className="w-full mt-12 bg-blue-600 h-20 rounded-[1.5rem] text-2xl font-black transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-3" /> Générer la lettre</>}
        </Button>
      </Card>

      {/* RESULT */}
      {result && (
        <Card className="p-12 bg-white border-blue-100 shadow-xl rounded-[3rem] relative animate-in fade-in duration-700">
          <div className="absolute top-8 right-8 flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copié" : "Copier"}
            </Button>
            <Button variant="default" size="sm" className="rounded-full gap-2 bg-blue-600 hover:bg-blue-700" onClick={downloadPDF}>
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>

          <div className="prose prose-blue max-w-none pt-10">
            <div className="whitespace-pre-wrap font-serif text-xl leading-relaxed text-slate-800">
              {result}
            </div>
          </div>
        </Card>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full space-y-6">
            <h2 className="text-xl font-bold text-center">Plus de crédits</h2>
            <p className="text-center text-slate-600">
              Tu n'as pas assez de crédits pour générer une lettre. Recharge maintenant !
            </p>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => setShowPaymentModal(false)}
                variant="outline"
              >
                Annuler
              </Button>

              <Button
                onClick={() => handlePayment("starter")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Recharger
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
