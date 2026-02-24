'use client';

import React from 'react';
import { Mail, Phone, MapPin, Trash2, XCircle, MinusCircle } from 'lucide-react';
import { CVData } from '@/utils/types';
import EditableText from '../EditableText';

interface PrimeAtsProps {
  data: CVData;
  onChange?: (newData: CVData) => void;
}

const PrimeAts: React.FC<PrimeAtsProps> = ({ data, onChange }) => {
  const { personalInfo, summary = "", experiences = [], education = [], skills = [], additionalInfo } = data;

  const handleUpdate = (path: string, val: any) => {
    if (data && (data as any).handleUpdate) {
      (data as any).handleUpdate(path, val);
    }
  };

  const removeSectionItem = (path: string, index: number) => {
    if (data && (data as any).removeItem) {
      (data as any).removeItem(path, index);
    }
  };

  // 1. Section Level Deletion
  const deleteSection = (sectionKey: keyof CVData) => {
    const emptyValue = Array.isArray(data[sectionKey]) ? [] : "";
    handleUpdate(sectionKey, emptyValue);
  };

  // 3. Sub-item Level Deletion with Auto-Clean
  const removeDescriptionBullet = (expIndex: number, bulletIndex: number) => {
    const currentExp = experiences[expIndex];
    const newDescription = currentExp.description.filter((_, idx) => idx !== bulletIndex);

    if (newDescription.length === 0) {
      // If no bullets left, delete the whole job entry
      removeSectionItem('experiences', expIndex);
    } else {
      handleUpdate(`experiences.${expIndex}.description`, newDescription);
    }
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
          gap: 'var(--cv-gap)' 
        }}
      >
        {/* Summary */}
        {summary && (
          <Section title="Résumé Professionnel" onDelete={() => deleteSection('summary')}>
            <div className="px-2 italic text-gray-700 text-sm">
              <EditableText 
                value={summary} 
                onSave={(v) => handleUpdate('summary', v)} 
                multiline 
                className="leading-relaxed"
              />
            </div>
          </Section>
        )}

        {/* Professional Experience */}
        {experiences.length > 0 && (
          <Section title="Expériences Professionnelles" onDelete={() => deleteSection('experiences')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-gap)' }}>
              {experiences.map((exp, index) => (
                <div key={index} className="px-2 group/item relative">
                  <button 
                    onClick={() => removeSectionItem('experiences', index)}
                    className="absolute -left-8 top-1 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                  >
                    <Trash2 size={16} />
                  </button>

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
                  <div className="ml-4 space-y-2">
                    {exp.description.map((desc, j) => (
                      <div key={j} className="group/subitem flex items-start gap-3 relative">
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
                        <button 
                          onClick={() => removeDescriptionBullet(index, j)}
                          className="opacity-0 group-hover/subitem:opacity-100 text-slate-300 hover:text-red-500 p-1 transition-all"
                        >
                          <MinusCircle size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-2 gap-10">
          {education.length > 0 && (
            <Section title="Formation" onDelete={() => deleteSection('education')}>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="group/item relative px-2">
                    <button 
                      onClick={() => removeSectionItem('education', index)}
                      className="absolute -left-6 top-0 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                    >
                      <Trash2 size={14} />
                    </button>
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
            </Section>
          )}

          {skillsArray.length > 0 && (
            <Section title="Compétences" onDelete={() => deleteSection('skills')}>
              <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                 <EditableText 
                  value={skillsArray.join(', ')} 
                  onSave={(v) => handleUpdate('skills', v.split(',').map((s: string) => s.trim()))} 
                  className="text-sm text-gray-700 leading-loose italic"
                />
              </div>
            </Section>
          )}
        </div>

        {/* Additional Info */}
        <Section title="Informations Complémentaires" onDelete={() => deleteSection('additionalInfo')}>
            <div className="bg-slate-900 rounded-2xl text-white p-6 shadow-xl grid grid-cols-3 gap-4 text-xs">
                <div>
                <p className="text-blue-400 mb-1 font-bold uppercase tracking-tighter">Langues</p>
                <EditableText 
                    value={additionalInfo.languages.join(', ')} 
                    onSave={(v) => handleUpdate('additionalInfo.languages', v.split(',').map((s: string) => s.trim()))} 
                />
                </div>
                <div>
                <p className="text-blue-400 mb-1 font-bold uppercase tracking-tighter">Certifications</p>
                <EditableText 
                    value={additionalInfo.certifications.join(', ')} 
                    onSave={(v) => handleUpdate('additionalInfo.certifications', v.split(',').map((s: string) => s.trim()))} 
                />
                </div>
                <div>
                <p className="text-blue-400 mb-1 font-bold uppercase tracking-tighter">Loisirs</p>
                <EditableText 
                    value={additionalInfo.interests.join(', ')} 
                    onSave={(v) => handleUpdate('additionalInfo.interests', v.split(',').map((s: string) => s.trim()))} 
                />
                </div>
            </div>
        </Section>
      </div>
    </div>
  );
};

// Reusable Section Wrapper for PrimeAts
const Section = ({ title, children, onDelete }: { title: string; children: React.ReactNode, onDelete: () => void }) => (
  <section className="group/section relative">
    <button 
      onClick={onDelete}
      className="absolute -right-2 top-0 opacity-0 group-hover/section:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
      title={`Supprimer la section ${title}`}
    >
      <XCircle size={16} />
    </button>
    <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 uppercase tracking-wider mb-3">
      {title}
    </h3>
    {children}
  </section>
);

export default PrimeAts;