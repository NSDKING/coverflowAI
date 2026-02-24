'use client';

import React from 'react';
import { CVData } from '@/utils/types';
import EditableText from '../EditableText';
import { Trash2, XCircle, MinusCircle } from 'lucide-react';

interface ProfessionalProps {
  data: CVData;
}

const Professional: React.FC<ProfessionalProps> = ({ data }) => {
  const { 
    personalInfo, 
    summary = "", 
    experiences = [], 
    education = [], 
    skills = [] 
  } = data;

  // Global update handler
  const onUpdate = (path: string, val: any) => {
    if (data && (data as any).handleUpdate) {
      (data as any).handleUpdate(path, val);
    }
  };

  // 1. Section Level Deletion: Clears the entire category
  const deleteSection = (sectionKey: keyof CVData) => {
    if (data && (data as any).handleUpdate) {
      const emptyValue = Array.isArray(data[sectionKey]) ? [] : "";
      (data as any).handleUpdate(sectionKey, emptyValue);
    }
  };

  // 2. Item Level Deletion: Removes a specific job or degree
  const removeSectionItem = (path: string, index: number) => {
    if (data && (data as any).removeItem) {
      (data as any).removeItem(path, index);
    }
  };

  // 3. Sub-item Level Deletion: Removes a bullet point
  // AUTO-CLEAN: If it's the last bullet, the whole job entry is removed.
  const removeDescriptionBullet = (expIndex: number, bulletIndex: number) => {
    const currentExp = experiences[expIndex];
    const newDescription = currentExp.description.filter((_, idx) => idx !== bulletIndex);

    if (newDescription.length === 0) {
      removeSectionItem('experiences', expIndex);
    } else {
      onUpdate(`experiences.${expIndex}.description`, newDescription);
    }
  };

  const skillsArray = Array.isArray(skills) 
    ? skills 
    : (typeof skills === 'string' ? (skills as string).split(',') : []);

  return (
    <div className="mx-auto bg-white flex h-full font-sans antialiased overflow-hidden border shadow-inner">
      
      {/* LEFT SIDEBAR - EMERALD DARK */}
      <aside 
        className="w-[33%] bg-[#064e3b] text-white flex flex-col transition-all relative"
        style={{ paddingTop: 'var(--cv-padding)', paddingBottom: 'var(--cv-padding)' }}
      >
        {/* Photo & Identity */}
        <div className="flex flex-col items-center px-8 text-center" style={{ marginBottom: 'var(--cv-gap)' }}>
          {personalInfo.photo && (
            <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden mb-6 shadow-xl">
              <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-2xl font-black tracking-tight mb-2 px-2">
            <EditableText value={personalInfo.fullName} onSave={(v) => onUpdate('personalInfo.fullName', v)} />
          </h1>
          <div className="w-10 h-[2px] bg-emerald-400 mb-4 rounded-full" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-200/90 font-bold leading-relaxed px-4">
            <EditableText value={personalInfo.jobTitle} onSave={(v) => onUpdate('personalInfo.jobTitle', v)} />
          </p>
        </div>

        {/* Contact & Skills */}
        <div className="px-8" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-gap)' }}>
          <section>
            <h3 className="text-[12px] font-black uppercase tracking-widest mb-4 text-emerald-300/80 border-b border-white/10 pb-2">Contact</h3>
            <div className="text-[11px] text-emerald-50/90 space-y-3 leading-relaxed">
              <div>
                <p className="text-[9px] uppercase font-bold text-emerald-400 mb-0.5">Localisation</p>
                <EditableText value={personalInfo.location} onSave={(v) => onUpdate('personalInfo.location', v)} />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-emerald-400 mb-0.5">Téléphone</p>
                <EditableText value={personalInfo.phone} onSave={(v) => onUpdate('personalInfo.phone', v)} />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-emerald-400 mb-0.5">Email</p>
                <EditableText value={personalInfo.email} onSave={(v) => onUpdate('personalInfo.email', v)} className="underline truncate block" />
              </div>
            </div>
          </section>

          {skillsArray.length > 0 && (
            <section className="group/section relative">
              <button 
                onClick={() => deleteSection('skills')}
                className="absolute -right-2 top-0 opacity-0 group-hover/section:opacity-100 text-red-400 hover:text-red-200 transition-all"
              >
                <XCircle size={14} />
              </button>
              <h3 className="text-[12px] font-black uppercase tracking-widest mb-4 text-emerald-300/80 border-b border-white/10 pb-2">Expertise</h3>
              <div className="space-y-4">
                 <div className="p-2 bg-black/10 rounded-lg border border-white/5">
                  <EditableText 
                    value={skillsArray.join(', ')} 
                    onSave={(v) => onUpdate('skills', v.split(',').map((s: string) => s.trim()))} 
                    className="text-[10px] leading-relaxed italic text-emerald-100/80"
                  />
                 </div>
              </div>
            </section>
          )}
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main 
        className="w-[67%] text-slate-800 bg-slate-50/30 transition-all overflow-y-auto"
        style={{ padding: 'var(--cv-padding)', display: 'flex', flexDirection: 'column', gap: 'var(--cv-gap)' }}
      >
        
        {/* PERSONAL SUMMARY */}
        {summary && (
          <Section title="Profil Personnel" onDelete={() => deleteSection('summary')}>
            <div className="p-3 bg-white/50 rounded-xl border border-slate-100 italic">
              <EditableText 
                value={summary} 
                onSave={(v) => onUpdate('summary', v)} 
                multiline 
                className="text-[13px] leading-relaxed text-slate-600"
              />
            </div>
          </Section>
        )}

        {/* WORK EXPERIENCE */}
        {experiences.length > 0 && (
          <Section title="Expériences" onDelete={() => deleteSection('experiences')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-gap)' }}>
              {experiences.map((exp, i) => (
                <div key={i} className="group/item relative">
                  {/* Item Delete Button */}
                  <button 
                    onClick={() => removeSectionItem('experiences', i)}
                    className="absolute -left-10 top-0 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all p-2"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <EditableText value={exp.role} onSave={(v) => onUpdate(`experiences.${i}.role`, v)} />
                      <span className="text-slate-300 font-light">@</span>
                      <EditableText value={exp.company} onSave={(v) => onUpdate(`experiences.${i}.company`, v)} />
                    </h3>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 shrink-0">
                      <EditableText value={exp.duration} onSave={(v) => onUpdate(`experiences.${i}.duration`, v)} />
                    </span>
                  </div>
                  
                  <div className="ml-2 border-l-2 border-slate-100 pl-5 mt-2 space-y-2">
                    {exp.description.map((desc, j) => (
                      <div key={j} className="group/subitem flex items-start gap-3 relative">
                        <span className="text-emerald-500 mt-2 text-[6px]">■</span>
                        <EditableText 
                          value={desc} 
                          onSave={(v) => {  
                            const newDesc = [...exp.description];
                            newDesc[j] = v;
                            onUpdate(`experiences.${i}.description`, newDesc);
                          }}
                          multiline 
                          className="text-[12px] leading-relaxed text-slate-600 flex-1"
                        />
                        {/* Sub-item Delete Button (Bullet) */}
                        <button 
                          onClick={() => removeDescriptionBullet(i, j)}
                          className="opacity-0 group-hover/subitem:opacity-100 text-slate-300 hover:text-red-400 p-1 transition-all shrink-0"
                          title="Supprimer cette ligne"
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

        {/* EDUCATION */}
        {education.length > 0 && (
          <Section title="Formation" onDelete={() => deleteSection('education')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-item-gap)' }}>
              {education.map((edu, i) => (
                <div key={i} className="group/item relative p-2 bg-white/50 rounded-lg border border-transparent hover:border-slate-100">
                  <button 
                    onClick={() => removeSectionItem('education', i)}
                    className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all p-2"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-[13px]">
                        <EditableText value={edu.degree} onSave={(v) => onUpdate(`education.${i}.degree`, v)} />
                      </h4>
                      <p className="text-slate-500 text-xs mt-0.5">
                        <EditableText value={edu.school} onSave={(v) => onUpdate(`education.${i}.school`, v)} />
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      <EditableText value={edu.year} onSave={(v) => onUpdate(`education.${i}.year`, v)} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>
    </div>
  );
};

// Reusable Section Wrapper with Title and Deletion capability
const Section = ({ title, children, onDelete }: { title: string; children: React.ReactNode, onDelete: () => void }) => (
  <section className="group/section relative">
    <button 
      onClick={onDelete}
      className="absolute -right-2 top-0 opacity-0 group-hover/section:opacity-100 text-slate-300 hover:text-red-500 transition-all"
      title={`Supprimer la section ${title}`}
    >
      <XCircle size={14} />
    </button>
    <div className="flex items-center gap-4 mb-4">
      <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] shrink-0">{title}</h2>
      <div className="h-[1px] bg-slate-200 flex-1" />
    </div>
    {children}
  </section>
);

export default Professional;