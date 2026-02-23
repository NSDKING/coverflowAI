'use client'
import React, { useState } from 'react'
 import { CVData } from '@/utils/types'
import { Button } from '@/components/ui/button'
import CVRenderer from '@/components/CVRender';

// Données de test ultra-complètes pour pousser les templates dans leurs retranchements
const MOCK_DATA: CVData = {
  personalInfo: {
    fullName: "Alexandre Dupont",
    jobTitle: "Architecte Solutions Cloud & DevOps",
    email: "a.dupont@tech.io",
    phone: "+33 6 12 34 56 78",
    location: "Lyon, France",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  summary: "Expert avec plus de 10 ans d'expérience dans la conception d'infrastructures scalables. Passionné par l'automatisation et l'optimisation des performances.",
  experiences: [
    {
      role: "Lead DevOps",
      company: "CloudScale Solutions",
      duration: "2020 - Présent",
      description: [
        "Migration de 200+ microservices vers Kubernetes (EKS)",
        "Réduction des coûts d'infrastructure de 35% via FinOps",
        "Mise en place de pipelines CI/CD complexes avec GitHub Actions"
      ]
    },
    {
      role: "Senior Fullstack Developer",
      company: "Innovate ERP",
      duration: "2016 - 2020",
      description: [
        "Développement du coeur métier de l'ERP en React et Node.js",
        "Management d'une équipe de 5 développeurs juniors",
        "Optimisation des requêtes SQL divisant le temps de réponse par 3"
      ]
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Kubernetes", "AWS", "Docker", "Terraform", "Python", "GraphQL", "PostgreSQL"],
  education: [
    {
      degree: "Master en Ingénierie Informatique",
      school: "INSA Lyon",
      year: "2015"
    }
  ]
};

const TEMPLATE_IDS = [
  'classic', 'minimal', 'professional', 'prime-ats', 
 ];

export default function TestPage() {
  const [currentTemplate, setCurrentTemplate] = useState('professional');
  const [zoom, setZoom] = useState(0.6); // Zoom par défaut pour voir le A4 en entier

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* BARRE D'OUTILS TEST */}
      <div className="fixed top-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-b border-slate-700 z-50 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_IDS.map(id => (
              <Button 
                key={id}
                variant={currentTemplate === id ? "default" : "outline"}
                className={currentTemplate === id ? "bg-blue-600" : "text-white border-slate-600"}
                onClick={() => setCurrentTemplate(id)}
              >
                {id}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 bg-slate-700 px-4 py-2 rounded-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Zoom</span>
            <input 
              type="range" min="0.3" max="1" step="0.1" 
              value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-32 cursor-pointer"
            />
            <span className="text-sm font-mono">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      {/* ZONE DE RENDU */}
      <div className="mt-24 flex flex-col items-center">
        <div className="mb-4 text-slate-400 text-sm italic">
          Rendu du template : <span className="text-blue-400 font-bold">{currentTemplate}</span>
        </div>
        
        {/* Conteneur avec scale dynamique */}
        <div 
          className="transition-all duration-300 ease-in-out shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top center'
          }}
        >
          <CVRenderer 
            data={MOCK_DATA} 
            templateId={currentTemplate} 
           />
        </div>
        
        {/* Espaceur pour compenser le scale car il ne réduit pas l'espace DOM occupé */}
        <div style={{ height: `${297 * zoom}mm` }} />
      </div>
    </div>
  )
}