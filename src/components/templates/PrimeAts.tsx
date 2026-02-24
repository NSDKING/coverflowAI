'use client';

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { CVData } from '@/utils/types';
import EditableText from '../EditableText';

interface PrimeAtsProps {
  data: CVData;
  onChange?: (newData: CVData) => void;
}

const PrimeAts: React.FC<PrimeAtsProps> = ({ data, onChange }) => {
  const { personalInfo, summary, experiences, education, skills, additionalInfo } = data;

  const handleUpdate = (path: string, val: any) => {
    if (!onChange) return;
    const newData = { ...data };
    const keys = path.split('.');
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = val;
    onChange(newData);
  };

  const skillsArray = Array.isArray(skills) ? skills : [];

  return (
    <div className="mx-auto bg-white font-sans text-gray-800 antialiased h-full">
      {/* Header Section */}
      <header 
        className="flex justify-between items-start border-b-2 border-blue-600 bg-slate-50/30 transition-all"
        style={{ padding: 'var(--cv-padding)' }}
      >
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-blue-700 uppercase tracking-tight">
            <EditableText 
              value={personalInfo.fullName || "Votre Nom"} 
              onSave={(v) => handleUpdate('personalInfo.fullName', v)} 
            />
          </h1>
          <h2 className="text-2xl font-semibold mt-1 text-gray-700">
            <EditableText 
              value={personalInfo.jobTitle || "Titre du Poste"} 
              onSave={(v) => handleUpdate('personalInfo.jobTitle', v)} 
            />
          </h2>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 p-1">
              <MapPin size={14} className="text-blue-600" /> 
              <EditableText value={personalInfo.location} onSave={(v) => handleUpdate('personalInfo.location', v)} />
            </span>
            <span className="flex items-center gap-1.5 p-1">
              <Phone size={14} className="text-blue-600" /> 
              <EditableText value={personalInfo.phone} onSave={(v) => handleUpdate('personalInfo.phone', v)} />
            </span>
            <span className="flex items-center gap-1.5 p-1">
              <Mail size={14} className="text-blue-600" /> 
              <EditableText value={personalInfo.email} onSave={(v) => handleUpdate('personalInfo.email', v)} className="underline" />
            </span>
          </div>
        </div>

        {personalInfo.photo && (
          <div className="ml-6 w-28 h-28 border-2 border-blue-100 overflow-hidden rounded-lg shadow-inner shrink-0">
            <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <div 
        style={{ 
          padding: 'var(--cv-padding)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--cv-gap)' // Elastic gap between sections
        }}
      >
        {/* Summary */}
        <section>
          <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 uppercase tracking-wider mb-2">
            Résumé Professionnel
          </h3>
          <div className="px-2 italic text-gray-700 text-sm">
            <EditableText 
              value={summary} 
              onSave={(v) => handleUpdate('summary', v)} 
              multiline 
              className="leading-relaxed"
            />
          </div>
        </section>

        {/* Professional Experience */}
        <section>
          <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 uppercase tracking-wider mb-4">
            Expériences Professionnelles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-gap)' }}>
            {experiences.map((exp, index) => (
              <div key={index} className="px-2">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg text-gray-900 flex gap-2">
                    <EditableText value={exp.role} onSave={(v) => handleUpdate(`experiences.${index}.role`, v)} />
                    <span className="text-gray-300 font-light">|</span>
                    <EditableText value={exp.company} onSave={(v) => handleUpdate(`experiences.${index}.company`, v)} />
                  </h4>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                    <EditableText value={exp.duration} onSave={(v) => handleUpdate(`experiences.${index}.duration`, v)} />
                  </span>
                </div>
                <div className="text-xs text-gray-400 uppercase font-bold mb-2 tracking-widest">
                   <EditableText value={exp.location} onSave={(v) => handleUpdate(`experiences.${index}.location`, v)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-item-gap)', marginLeft: '1rem' }}>
                  {exp.description.map((desc, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1.5 text-[8px]">●</span>
                      <EditableText 
                        value={desc} 
                        onSave={(v) => {  
                          const newDesc = [...exp.description];
                          newDesc[j] = v;
                          handleUpdate(`experiences.${index}.description`, newDesc);
                        }}
                        multiline 
                        className="text-sm leading-relaxed text-gray-600 flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-2 gap-10">
          <section>
            <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wider">Formation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-item-gap)' }}>
              {education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-bold text-gray-900 text-sm">
                    <EditableText value={edu.degree} onSave={(v) => handleUpdate(`education.${index}.degree`, v)} />
                  </h4>
                  <p className="text-gray-600 text-xs">
                    <EditableText value={edu.school} onSave={(v) => handleUpdate(`education.${index}.school`, v)} />
                  </p>
                  <p className="text-blue-600 font-bold text-[10px] mt-0.5">
                    <EditableText value={edu.year} onSave={(v) => handleUpdate(`education.${index}.year`, v)} />
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wider">Compétences</h3>
            <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
               <EditableText 
                value={skillsArray.join(', ')} 
                onSave={(v) => handleUpdate('skills', v.split(',').map((s: string) => s.trim()))} 
                className="text-sm text-gray-700 leading-loose italic"
              />
            </div>
          </section>
        </div>

        {/* Footer info */}
        <section 
          className="bg-slate-900 rounded-2xl text-white shadow-xl mt-auto"
          style={{ padding: 'var(--cv-gap)' }}
        >
          <h3 className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Informations Complémentaires</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-slate-400 mb-1 font-bold">LANGUES</p>
              <EditableText 
                value={additionalInfo.languages.join(', ')} 
                onSave={(v) => handleUpdate('additionalInfo.languages', v.split(',').map((s: string) => s.trim()))} 
              />
            </div>
            <div>
              <p className="text-slate-400 mb-1 font-bold">CERTIFICATIONS</p>
              <EditableText 
                value={additionalInfo.certifications.join(', ')} 
                onSave={(v) => handleUpdate('additionalInfo.certifications', v.split(',').map((s: string) => s.trim()))} 
              />
            </div>
            <div>
              <p className="text-slate-400 mb-1 font-bold">LOISIRS</p>
              <EditableText 
                value={additionalInfo.interests.join(', ')} 
                onSave={(v) => handleUpdate('additionalInfo.interests', v.split(',').map((s: string) => s.trim()))} 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrimeAts;