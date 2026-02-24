// components/CVRenderer.tsx
'use client';

import React from 'react';
import { CVData } from '@/utils/types';
import EditableText from './EditableText';

// Import de tes templates
import PrimeAts from './templates/PrimeAts';
import MinimalAts from './templates/MinimalAts';
import Classic from './templates/Classic';
import Professional from './templates/Professional';

interface Props {
  data: CVData;
  templateId: string;
  profileImage?: string | null;
  onChange?: (newData: CVData) => void;
}

export default function CVRenderer({ data, templateId, profileImage, onChange }: Props) {
  
  /**
   * LOGIQUE DE MISE À JOUR DYNAMIQUE
   * Permet de modifier une valeur n'importe où dans l'objet via un chemin (ex: "experiences.0.role")
   */
  const handleUpdate = (path: string, newValue: any) => {
    if (!onChange) return;

    // 1. On crée une copie profonde pour éviter de muter l'état directement
    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let current = newData;

    // 2. On parcourt l'objet jusqu'à l'avant-dernière clé
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      // Si la clé est un index de tableau (ex: "0", "1")
      const accessKey = isNaN(Number(key)) ? key : Number(key);
      current = current[accessKey];
    }

    // 3. On applique la nouvelle valeur sur la dernière clé
    const lastKey = keys[keys.length - 1];
    const finalKey = isNaN(Number(lastKey)) ? lastKey : Number(lastKey);
    current[finalKey] = newValue;

    // 4. On renvoie l'objet complet mis à jour au parent
    onChange(newData);
  };

  if (!data) return null;

  /**
   * FORMATTAGE DES DONNÉES (Adapter)
   * On prépare les alias pour que les templates ATS ou Classiques reçoivent 
   * les données dans le format qu'ils attendent.
   */
  const formattedData = {
    ...data,
    name: data.personalInfo?.fullName,
    title: data.personalInfo?.jobTitle,
    profileImage: profileImage || data.personalInfo?.photo,
    contact: {
      address: data.personalInfo?.location,
      phone: data.personalInfo?.phone,
      email: data.personalInfo?.email,
    },
    // On passe les outils d'édition directement aux templates
    handleUpdate,
    EditableText
  };

  /**
   * SÉLECTEUR DE TEMPLATE
   */
  const renderTemplate = () => {
    switch (templateId) {
      case 'modern':
      case 'professional':
        return <Professional data={formattedData} />;
      
      case 'prime-ats':
        return <PrimeAts data={formattedData} />;

      case 'minimal':
        return (
          <MinimalAts 
            data={{
              ...formattedData,
              // Adaptation spécifique pour MinimalAts si nécessaire
              skills: {
                technical: data.skills?.slice(0, 5) || [],
                soft: data.skills?.slice(5, 10) || []
              }
            }} 
          />
        );

      case 'classic':
        return <Classic data={formattedData} />;

      default:
        return (
          <div className="p-20 bg-white text-slate-900 text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <h2 className="text-xl font-bold">Design non trouvé</h2>
            <p className="text-slate-500">Veuillez sélectionner un autre template.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Container au format A4 réel */}
      <div 
        className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out"
        style={{
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
        }}
      >
        {renderTemplate()}
      </div>

      {/* Message d'aide discret en bas du CV */}
      <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs font-medium bg-white/50 px-4 py-2 rounded-full border border-slate-200">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        Mode édition active : Double-cliquez sur n'importe quel texte pour le modifier
      </div>
    </div>
  );
}