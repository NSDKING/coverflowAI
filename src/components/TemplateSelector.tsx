'use client';

import { Card } from "@/components/ui/card";
import { CVData } from "@/utils/types";
import { CheckCircle2, Sparkles } from "lucide-react";
import CVRenderer from "./CVRender";

interface Props {
  onSelect: (id: string) => void;
  selectedId?: string;
  cvData: CVData | null;
}

const TEMPLATE_IDS = ['classic', 'minimal', 'professional', 'prime-ats'];

export default function TemplateSelector({ onSelect, selectedId, cvData }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-blue-600" size={20} />
        <h3 className="text-xl font-bold">Sélectionnez votre design</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {TEMPLATE_IDS.map((id) => (
          <Card 
            key={id}
            onClick={() => onSelect(id)}
            className={`group cursor-pointer overflow-hidden border-2 transition-all rounded-xl shadow-sm hover:shadow-xl ${
              selectedId === id ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100 hover:border-blue-300'
            }`}
          >
            <div className="h-48 bg-slate-200 relative overflow-hidden flex justify-center border-b">
              <div className="absolute top-2 origin-top transform scale-[0.18] pointer-events-none shadow-2xl">
                <CVRenderer 
                  data={cvData || mockData} 
                  templateId={id} 
                />
              </div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                 <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                   Aperçu {id}
                 </div>
              </div>

              {selectedId === id && (
                <div className="absolute top-2 right-2 text-white bg-blue-600 rounded-full p-1 shadow-lg z-10">
                  <CheckCircle2 size={16} />
                </div>
              )}
            </div>

            <div className="p-3 bg-white">
              <span className="font-bold text-xs text-slate-700 block truncate">{id}</span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">Template</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Complete mockData satisfying the full CVData interface
const mockData: CVData = {
    personalInfo: { 
      fullName: "Nom Prénom", 
      jobTitle: "Poste Actuel", 
      email: "demo@example.com", 
      phone: "01 23 45 67 89", 
      location: "Paris, France" 
    },
    summary: "Professionnel passionné avec une expertise en développement de solutions innovantes.",
    experiences: [{ 
      role: "Expérience", 
      company: "Entreprise", 
      duration: "2024", 
      location: "Ville, Pays", 
      description: ["Réalisation de projets clés.", "Optimisation des processus."] 
    }],
    skills: ["React", "TypeScript", "Tailwind CSS"],
    education: [{ 
      degree: "Diplôme", 
      school: "École", 
      year: "2023",
      location: "Ville, Pays"  
    }],
    additionalInfo: {
      languages: ["Français (Maternel)", "Anglais (Avancé)"],
      certifications: ["AWS Certified"],
      interests: ["Voyages", "Photographie"]
    },
    customBlocks: []  
};