'use client';

import React from 'react';
import { CVData } from '@/utils/types';
import EditableText from '../EditableText';

interface ProfessionalProps {
  data: CVData;
}

const Professional: React.FC<ProfessionalProps> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills } = data;

  // Injection sécurisée de la fonction de mise à jour du parent
  const onSave = (path: string, val: any) => {
    if (data && (data as any).handleUpdate) {
      (data as any).handleUpdate(path, val);
    }
  };

  const skillsArray = Array.isArray(skills) 
    ? skills 
    : (typeof skills === 'string' ? (skills as string).split(',') : []);

  return (
    <div className="w-[210mm] min-h-[297mm] mx-auto bg-white flex shadow-2xl font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR GAUCHE - EMERALD DARK */}
      <aside className="w-[33%] bg-[#064e3b] text-white flex flex-col pt-12 pb-10">
        
        {/* Photo & Nom */}
        <div className="flex flex-col items-center px-8 mb-10 text-center">
          {personalInfo.photo && (
            <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden mb-6 shadow-xl transition-transform hover:scale-105">
              <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-2xl font-black tracking-tight mb-2 hover:bg-white/10 rounded px-2 transition-colors cursor-pointer">
            <EditableText 
              value={personalInfo.fullName || "Votre Nom"} 
              onSave={(v) => onSave('personalInfo.fullName', v)} 
            />
          </h1>
          <div className="w-10 h-[2px] bg-emerald-400 mb-4 rounded-full" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-200/90 font-bold leading-relaxed px-4 hover:bg-white/10 rounded">
            <EditableText 
              value={personalInfo.jobTitle || "Titre du Poste"} 
              onSave={(v) => onSave('personalInfo.jobTitle', v)} 
            />
          </p>
        </div>

        {/* Contact & Skills */}
        <div className="px-8 space-y-12">
          <section>
            <h3 className="text-[12px] font-black uppercase tracking-widest mb-5 text-emerald-300/80 border-b border-white/10 pb-2">Contact</h3>
            <div className="text-[11px] text-emerald-50/90 space-y-4 leading-relaxed">
              <div className="hover:bg-white/5 p-1 rounded cursor-pointer">
                <p className="text-[9px] uppercase font-bold text-emerald-400 mb-0.5">Localisation</p>
                <EditableText value={personalInfo.location} onSave={(v) => onSave('personalInfo.location', v)} />
              </div>
              <div className="hover:bg-white/5 p-1 rounded cursor-pointer">
                <p className="text-[9px] uppercase font-bold text-emerald-400 mb-0.5">Téléphone</p>
                <EditableText value={personalInfo.phone} onSave={(v) => onSave('personalInfo.phone', v)} />
              </div>
              <div className="hover:bg-white/5 p-1 rounded cursor-pointer">
                <p className="text-[9px] uppercase font-bold text-emerald-400 mb-0.5">Email</p>
                <EditableText value={personalInfo.email} onSave={(v) => onSave('personalInfo.email', v)} className="underline truncate block" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[12px] font-black uppercase tracking-widest mb-5 text-emerald-300/80 border-b border-white/10 pb-2">Expertise</h3>
            <div className="space-y-5">
               <div className="p-2 bg-black/10 rounded-lg border border-white/5">
                <EditableText 
                  value={skillsArray.join(', ')} 
                  onSave={(v) => onSave('skills', v.split(',').map((s: string) => s.trim()))} 
                  className="text-[10px] leading-relaxed italic text-emerald-100/80"
                />
               </div>
              
              {/* Skill bars visual indicator */}
              <div className="space-y-4 pt-2">
                {skillsArray.slice(0, 4).map((skill, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] uppercase font-bold tracking-tighter">
                      <span>{skill}</span>
                      <span className="text-emerald-400">85%</span>
                    </div>
                    <div className="h-[3px] bg-white/10 w-full rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 w-[85%] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* CONTENU DROIT - MAIN CONTENT */}
      <main className="w-[67%] p-14 text-slate-800 bg-slate-50/30">
        
        <Section title="Profil Personnel">
          <div className="p-3 hover:bg-white hover:shadow-md transition-all rounded-xl border border-transparent hover:border-slate-100">
            <EditableText 
              value={summary || ""} 
              onSave={(v) => onSave('summary', v)} 
              multiline 
              className="text-[13px] leading-7 text-slate-600 italic"
            />
          </div>
        </Section>

        <Section title="Expériences">
          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <div key={i} className="group relative">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                    <EditableText value={exp.role} onSave={(v) => onSave(`experiences.${i}.role`, v)} />
                    <span className="text-slate-300 font-light">@</span>
                    <EditableText value={exp.company} onSave={(v) => onSave(`experiences.${i}.company`, v)} />
                  </h3>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                    <EditableText value={exp.duration} onSave={(v) => onSave(`experiences.${i}.duration`, v)} />
                  </span>
                </div>
                
                <div className="ml-2 border-l-2 border-slate-100 pl-5 space-y-2 mt-3">
                  {exp.description.map((desc, j) => (
                    <div key={j} className="flex items-start gap-3 group/line">
                      <span className="text-emerald-500 mt-2 text-[6px]">■</span>
                      <EditableText 
                        value={desc} 
                        onSave={(v) => {  
                          const newDesc = [...exp.description];
                          newDesc[j] = v;
                          onSave(`experiences.${i}.description`, newDesc);
                        }}
                        multiline 
                        className="text-[12px] leading-relaxed text-slate-600 flex-1 hover:text-slate-900"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Formation">
          <div className="grid grid-cols-1 gap-6">
            {education.map((edu, i) => (
              <div key={i} className="p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-[13px]">
                      <EditableText value={edu.degree} onSave={(v) => onSave(`education.${i}.degree`, v)} />
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      <EditableText value={edu.school} onSave={(v) => onSave(`education.${i}.school`, v)} />
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    <EditableText value={edu.year} onSave={(v) => onSave(`education.${i}.year`, v)} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
};

// Helper Section component pour la cohérence visuelle
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12 last:mb-0">
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h2>
      <div className="h-[1px] bg-slate-200 flex-1" />
    </div>
    {children}
  </section>
);

export default Professional;