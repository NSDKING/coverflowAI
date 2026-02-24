'use client';

import React from 'react';
import { CVData } from '@/utils/types';
import EditableText from '../EditableText';
import { Trash2, XCircle, MinusCircle } from 'lucide-react';

interface ClassicProps {
  data: CVData;
}

const Classic = ({ data }: ClassicProps) => {
  const { 
    personalInfo, 
    summary = "", 
    experiences = [], 
    education = [], 
    skills = [], 
    additionalInfo 
  } = data;
  
  const onSave = (path: string, val: any) => {
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
    onSave(sectionKey, emptyValue);
  };

  // 3. Sub-item Level Deletion with Auto-Clean
  const removeDescriptionBullet = (expIndex: number, bulletIndex: number) => {
    const currentExp = experiences[expIndex];
    const newDescription = currentExp.description.filter((_, idx) => idx !== bulletIndex);

    if (newDescription.length === 0) {
      // Auto-delete the entire header if no text remains
      removeSectionItem('experiences', expIndex);
    } else {
      onSave(`experiences.${expIndex}.description`, newDescription);
    }
  };

  const skillsArray = Array.isArray(skills) ? skills : [];

  return (
    <div 
      className="bg-white font-serif text-slate-900 shadow-sm transition-all h-full"
      style={{ padding: 'var(--cv-padding)' }}
    >
      
      {/* Header */}
      <header 
        className="text-center border-b-2 border-slate-900"
        style={{ marginBottom: 'var(--cv-gap)', paddingBottom: 'var(--cv-item-gap)' }}
      >
        <h1 className="text-3xl font-bold tracking-tight uppercase mb-1">
          <EditableText 
            value={personalInfo.fullName || "Votre Nom"} 
            onSave={(v) => onSave('personalInfo.fullName', v)} 
          />
        </h1>
        <h2 className="text-sm font-medium tracking-[0.3em] text-slate-500 uppercase mb-2">
          <EditableText 
            value={personalInfo.jobTitle || "Titre du Poste"} 
            onSave={(v) => onSave('personalInfo.jobTitle', v)} 
          />
        </h2>
        
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[11px] font-sans font-semibold text-slate-600 uppercase tracking-wider">
          <span><EditableText value={personalInfo.location} onSave={(v) => onSave('personalInfo.location', v)} /></span>
          <span className="text-slate-300">|</span>
          <span><EditableText value={personalInfo.phone} onSave={(v) => onSave('personalInfo.phone', v)} /></span>
          <span className="text-slate-300">|</span>
          <span className="underline underline-offset-2"><EditableText value={personalInfo.email} onSave={(v) => onSave('personalInfo.email', v)} /></span>
        </div>
      </header>

      {/* Profil */}
      {summary && (
        <Section title="Profil" onDelete={() => deleteSection('summary')}>
          <EditableText 
            value={summary} 
            onSave={(v) => onSave('summary', v)} 
            multiline 
            className="text-[13px] leading-relaxed text-justify italic font-sans text-slate-700"
          />
        </Section>
      )}

      {/* Expérience */}
      {experiences.length > 0 && (
        <Section title="Expérience" onDelete={() => deleteSection('experiences')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-gap)' }}>
            {experiences.map((job, i) => (
              <div key={i} className="group/item relative">
                <button 
                  onClick={() => removeSectionItem('experiences', i)}
                  className="absolute -left-6 top-0 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                >
                  <Trash2 size={14} />
                </button>

                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm uppercase tracking-tight">
                    <EditableText value={job.role} onSave={(v) => onSave(`experiences.${i}.role`, v)} />
                    <span className="mx-2 font-normal text-slate-400">@</span>
                    <EditableText value={job.company} onSave={(v) => onSave(`experiences.${i}.company`, v)} />
                  </h3>
                  <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest">
                    <EditableText value={job.duration} onSave={(v) => onSave(`experiences.${i}.duration`, v)} />
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-2">
                  <EditableText value={job.location} onSave={(v) => onSave(`experiences.${i}.location`, v)} />
                </div>
                <div 
                  className="border-l border-slate-100 ml-1 pl-4"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-item-gap)' }}
                >
                  {job.description.map((desc, j) => (
                    <div key={j} className="flex items-start gap-3 group/subitem relative">
                      <span className="text-[8px] mt-1.5 text-slate-300">●</span>
                      <EditableText 
                        value={desc} 
                        onSave={(v) => {  
                          const newDesc = [...job.description];
                          newDesc[j] = v;
                          onSave(`experiences.${i}.description`, newDesc);
                        }}
                        multiline 
                        className="text-[12px] leading-relaxed text-slate-600 flex-1"
                      />
                      <button 
                        onClick={() => removeDescriptionBullet(i, j)}
                        className="opacity-0 group-hover/subitem:opacity-100 text-slate-300 hover:text-red-500 transition-all shrink-0"
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

      {/* Formation */}
      {education.length > 0 && (
        <Section title="Formation" onDelete={() => deleteSection('education')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-item-gap)' }}>
            {education.map((edu, i) => (
              <div key={i} className="group/item relative flex justify-between items-start">
                 <button 
                  onClick={() => removeSectionItem('education', i)}
                  className="absolute -left-6 top-0 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex-1">
                  <h3 className="font-bold text-[13px] uppercase">
                    <EditableText value={edu.school} onSave={(v) => onSave(`education.${i}.school`, v)} />
                  </h3>
                  <p className="text-[12px] italic text-slate-500 mt-0.5">
                    <EditableText value={edu.degree} onSave={(v) => onSave(`education.${i}.degree`, v)} />
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-sans font-bold text-slate-400">
                    <EditableText value={edu.year} onSave={(v) => onSave(`education.${i}.year`, v)} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Expertise */}
      <Section title="Expertise" onDelete={() => deleteSection('skills')}>
        <div className="grid grid-cols-2 gap-8 text-[12px]">
          <div className="space-y-1">
            <h4 className="font-sans font-black text-[9px] uppercase tracking-widest text-slate-400">Compétences</h4>
            <div className="p-2 bg-slate-50 rounded">
              <EditableText 
                value={skillsArray.join(', ')} 
                onSave={(v) => onSave('skills', v.split(',').map((s: string) => s.trim()))} 
                className="leading-relaxed"
              />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="font-sans font-black text-[9px] uppercase tracking-widest text-slate-400">Langues & Loisirs</h4>
            <div className="space-y-0.5">
               <p className="flex gap-2">
                 <span className="font-bold italic text-slate-800">Langues:</span>
                 <EditableText value={additionalInfo.languages.join(', ')} onSave={(v) => onSave('additionalInfo.languages', v.split(',').map((s: string) => s.trim()))} />
               </p>
               <p className="flex gap-2">
                 <span className="font-bold italic text-slate-800">Loisirs:</span>
                 <EditableText value={additionalInfo.interests.join(', ')} onSave={(v) => onSave('additionalInfo.interests', v.split(',').map((s: string) => s.trim()))} />
               </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer Certifications */}
      {additionalInfo.certifications.length > 0 && (
        <div 
          className="group/sec relative border-t border-slate-100 text-[10px] uppercase font-sans tracking-[0.2em] text-slate-400 text-center"
          style={{ marginTop: 'var(--cv-gap)', paddingTop: 'var(--cv-item-gap)' }}
        >
          <button 
            onClick={() => onSave('additionalInfo.certifications', [])}
            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/sec:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
          >
            <XCircle size={14} />
          </button>
          <span className="font-black text-slate-900 mr-3">Certifications:</span>
          <EditableText 
            value={additionalInfo.certifications.join(' — ')} 
            onSave={(v) => onSave('additionalInfo.certifications', v.split('—').map((s: string) => s.trim()))} 
          />
        </div>
      )}
    </div>
  );
};

// Reusable Section for Classic template
const Section = ({ title, children, onDelete }: { title: string, children: React.ReactNode, onDelete?: () => void }) => (
  <div 
    className="flex group/sec"
    style={{ marginBottom: 'var(--cv-gap)' }}
  >
    <div className="w-[100px] flex-shrink-0 pt-1 relative">
      <h2 className="text-[10px] font-sans font-black tracking-[0.25em] uppercase text-slate-300 group-hover/sec:text-slate-900 transition-colors">
        {title}
      </h2>
      {onDelete && (
        <button 
          onClick={onDelete}
          className="absolute -left-6 top-0 opacity-0 group-hover/sec:opacity-100 text-slate-200 hover:text-red-400 transition-all"
        >
          <XCircle size={14} />
        </button>
      )}
    </div>
    <div className="flex-1 pl-8 border-l border-slate-50 group-hover/sec:border-slate-200 transition-colors relative">
      {children}
    </div>
  </div>
);

export default Classic;