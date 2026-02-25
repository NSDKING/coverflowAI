'use client';

import React from 'react';
import { Mail, Phone, MapPin, Trash2, XCircle, MinusCircle, PlusCircle } from 'lucide-react';
import { CVData, CustomBlock } from '@/utils/types';
import EditableText from '../EditableText';

interface PrimeAtsProps {
  data: CVData;
}

const PrimeAts: React.FC<PrimeAtsProps> = ({ data }) => {
  const { 
    personalInfo, 
    summary = "", 
    experiences = [], 
    education = [], 
    skills = [], 
    additionalInfo,
    customBlocks = [] 
  } = data;

  const onUpdate = (path: string, val: any) => {
    if (data && (data as any).handleUpdate) {
      (data as any).handleUpdate(path, val);
    }
  };

  const removeSectionItem = (path: string, index: number) => {
    if (data && (data as any).removeItem) {
      (data as any).removeItem(path, index);
    }
  };

  const deleteSection = (sectionKey: keyof CVData) => {
    onUpdate(sectionKey, Array.isArray(data[sectionKey]) ? [] : "");
  };

  const addCustomElement = (targetSection: string, type: 'title' | 'text') => {
    const newBlock: CustomBlock = {
      id: Math.random().toString(36).substr(2, 9),
      section: targetSection,
      type,
      content: type === 'title' ? 'Nouveau Titre' : 'Saisissez votre texte ici...'
    };
    onUpdate('customBlocks', [...customBlocks, newBlock]);
  };

  const skillsArray = Array.isArray(skills) ? skills : [];

  return (
    <div 
      className="mx-auto bg-white font-sans text-gray-800 antialiased h-full flex flex-col"
      style={{ fontSize: 'var(--cv-font-base)', lineHeight: '1.4' }}
    >
      {/* Header Section */}
      <header 
        className="flex justify-between items-start border-b-2 border-blue-600 bg-slate-50/30"
        style={{ padding: 'var(--cv-padding)' }}
      >
        <div className="flex-1">
          <h1 className="font-bold text-blue-700 uppercase tracking-tight leading-none" style={{ fontSize: '2.5em' }}>
            <EditableText value={personalInfo.fullName} onSave={(v) => onUpdate('personalInfo.fullName', v)} />
          </h1>
          <h2 className="font-semibold mt-1 text-gray-700" style={{ fontSize: '1.5em' }}>
            <EditableText value={personalInfo.jobTitle} onSave={(v) => onUpdate('personalInfo.jobTitle', v)} />
          </h2>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4" style={{ fontSize: '0.85em' }}>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-600 shrink-0" /> 
              <EditableText value={personalInfo.location} onSave={(v) => onUpdate('personalInfo.location', v)} />
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-blue-600 shrink-0" /> 
              <EditableText value={personalInfo.phone} onSave={(v) => onUpdate('personalInfo.phone', v)} />
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-blue-600 shrink-0" /> 
              <EditableText value={personalInfo.email} onSave={(v) => onUpdate('personalInfo.email', v)} className="underline" />
            </span>
          </div>
        </div>

        {personalInfo.photo && (
          <div className="ml-6 w-24 h-24 border-2 border-blue-100 overflow-hidden rounded-lg shrink-0">
            <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      {/* Main Body */}
      <div 
        className="flex-1"
        style={{ 
          padding: 'var(--cv-padding)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--cv-gap)' 
        }}
      >
        {/* Summary */}
        {summary && (
          <Section title="Résumé Professionnel" onDelete={() => deleteSection('summary')} onAdd={() => addCustomElement('summary', 'text')}>
            <div className="px-1 italic text-gray-700 leading-relaxed" style={{ fontSize: '0.95em' }}>
              <EditableText value={summary} onSave={(v) => onUpdate('summary', v)} multiline />
            </div>
          </Section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <Section title="Expériences Professionnelles" onDelete={() => deleteSection('experiences')} onAdd={() => addCustomElement('experiences', 'text')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-gap)' }}>
              {experiences.map((exp, i) => (
                <div key={i} className="px-1 group/item relative">
                  <button onClick={() => removeSectionItem('experiences', i)} className="absolute -left-8 top-1 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                  
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-gray-900 flex gap-2" style={{ fontSize: '1.1em' }}>
                      <EditableText value={exp.role} onSave={(v) => onUpdate(`experiences.${i}.role`, v)} />
                      <span className="text-gray-300 font-light">|</span>
                      <EditableText value={exp.company} onSave={(v) => onUpdate(`experiences.${i}.company`, v)} />
                    </h4>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0" style={{ fontSize: '0.75em' }}>
                      <EditableText value={exp.duration} onSave={(v) => onUpdate(`experiences.${i}.duration`, v)} />
                    </span>
                  </div>
                  
                  <div className="text-gray-400 uppercase font-bold mb-1 tracking-widest" style={{ fontSize: '0.7em' }}>
                    <EditableText value={exp.location} onSave={(v) => onUpdate(`experiences.${i}.location`, v)} />
                  </div>
                  
                  {/* Aggressive Bullet Point Squeeze */}
                  <div className="ml-1 space-y-1">
                    {exp.description.map((desc, j) => (
                      <div 
                        key={j} 
                        className="group/subitem flex items-start relative"
                        style={{ gap: 'calc(var(--cv-item-gap) * 0.4)' }} 
                      >
                        <span className="text-blue-400 mt-1.5 text-[6px] shrink-0">●</span>
                        <EditableText 
                          value={desc} 
                          onSave={(v) => { 
                            const n = [...exp.description]; n[j] = v;
                            onUpdate(`experiences.${i}.description`, n);
                          }} 
                          multiline 
                          className="text-gray-600 flex-1 leading-tight"
                          style={{ fontSize: '0.9em' }}
                        />
                        <button onClick={() => {
                          const n = exp.description.filter((_, idx) => idx !== j);
                          if (n.length === 0) removeSectionItem('experiences', i);
                          else onUpdate(`experiences.${i}.description`, n);
                        }} className="opacity-0 group-hover/subitem:opacity-100 text-slate-300 hover:text-red-500 p-0.5 shrink-0"><MinusCircle size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {education.length > 0 && (
            <Section title="Formation" onDelete={() => deleteSection('education')} onAdd={() => addCustomElement('education', 'text')}>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i} className="group/item relative px-1">
                    <button onClick={() => removeSectionItem('education', i)} className="absolute -left-6 top-0 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                    <h4 className="font-bold text-gray-900 leading-tight" style={{ fontSize: '0.9em' }}><EditableText value={edu.degree} onSave={(v) => onUpdate(`education.${i}.degree`, v)} /></h4>
                    <p className="text-gray-600 mt-0.5" style={{ fontSize: '0.8em' }}><EditableText value={edu.school} onSave={(v) => onUpdate(`education.${i}.school`, v)} /></p>
                    <p className="text-blue-600 font-bold mt-0.5" style={{ fontSize: '0.7em' }}><EditableText value={edu.year} onSave={(v) => onUpdate(`education.${i}.year`, v)} /></p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {skillsArray.length > 0 && (
            <Section title="Compétences" onDelete={() => deleteSection('skills')} onAdd={() => addCustomElement('skills', 'text')}>
              <div className="bg-slate-50/50 p-2.5 rounded-lg border border-dashed border-slate-200">
                <EditableText 
                  value={skillsArray.join(', ')} 
                  onSave={(v) => onUpdate('skills', v.split(',').map((s: string) => s.trim()))} 
                  className="text-gray-700 italic leading-snug" 
                  style={{ fontSize: '0.85em' }}
                />
              </div>
            </Section>
          )}
        </div>

        {additionalInfo && (
          <Section title="Informations Complémentaires" onDelete={() => deleteSection('additionalInfo')} onAdd={() => addCustomElement('additionalInfo', 'text')}>
            <div className="bg-slate-900 rounded-xl text-white p-5 grid grid-cols-3 gap-4" style={{ fontSize: '0.75em' }}>
              <div>
                <p className="text-blue-400 mb-1 font-bold uppercase tracking-tighter">Langues</p>
                <EditableText value={additionalInfo.languages.join(', ')} onSave={(v) => onUpdate('additionalInfo.languages', v.split(',').map(s => s.trim()))} />
              </div>
              <div>
                <p className="text-blue-400 mb-1 font-bold uppercase tracking-tighter">Certifications</p>
                <EditableText value={additionalInfo.certifications.join(', ')} onSave={(v) => onUpdate('additionalInfo.certifications', v.split(',').map(s => s.trim()))} />
              </div>
              <div>
                <p className="text-blue-400 mb-1 font-bold uppercase tracking-tighter">Loisirs</p>
                <EditableText value={additionalInfo.interests.join(', ')} onSave={(v) => onUpdate('additionalInfo.interests', v.split(',').map(s => s.trim()))} />
              </div>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children, onDelete, onAdd }: any) => (
  <section className="group/section relative">
    <button onClick={onDelete} className="absolute -right-2 top-0 opacity-0 group-hover/section:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"><XCircle size={16} /></button>
    <h3 className="font-bold text-blue-700 border-b border-blue-100 pb-0.5 uppercase tracking-wider mb-2" style={{ fontSize: '1em' }}>{title}</h3>
    {children}
    <button onClick={onAdd} className="opacity-0 group-hover/section:opacity-100 transition-opacity mt-2 text-[9px] font-bold text-blue-400 hover:text-blue-600 flex items-center gap-1">
      <PlusCircle size={10}/> AJOUTER UN BLOC
    </button>
  </section>
);

export default PrimeAts;