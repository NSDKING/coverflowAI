'use client';

import React from 'react';
import { CVData } from '@/utils/types';
import EditableText from '../EditableText';
import { Trash2 } from 'lucide-react';

interface MinimalAtsProps {
  data: CVData;
}

const MinimalAts: React.FC<MinimalAtsProps> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, additionalInfo } = data;

  const onSave = (path: string, val: any) => {
    if (data && (data as any).handleUpdate) {
      (data as any).handleUpdate(path, val);
    }
  };

  // Helper for deleting items
  const removeSectionItem = (path: string, index: number) => {
    if (data && (data as any).removeItem) {
      (data as any).removeItem(path, index);
    }
  };

  const skillsArray = Array.isArray(skills) ? skills : [];

  return (
    <div 
      className="mx-auto bg-white font-serif text-gray-900 leading-tight transition-all duration-300 h-full"
      style={{
        padding: 'var(--cv-padding)',
      }}
    >
      {/* Header */}
      <header 
        className="flex flex-col items-center text-center border-b-2 border-black"
        style={{ 
          paddingBottom: 'var(--cv-gap)', 
          marginBottom: 'var(--cv-gap)' 
        }}
      >
        <h1 className="text-5xl font-bold mb-4 tracking-tighter uppercase hover:bg-gray-50 rounded px-4 py-1 transition-colors">
          <EditableText 
            value={personalInfo.fullName || "NOM PRÉNOM"} 
            onSave={(v) => onSave('personalInfo.fullName', v)} 
          />
        </h1>
        
        <div className="flex flex-wrap justify-center gap-3 text-[12px] font-sans font-bold uppercase tracking-widest text-gray-600">
          <span className="hover:text-black transition-colors px-1">
            <EditableText value={personalInfo.location} onSave={(v) => onSave('personalInfo.location', v)} />
          </span>
          <span className="text-gray-300">•</span>
          <span className="hover:text-black transition-colors px-1">
            <EditableText value={personalInfo.phone} onSave={(v) => onSave('personalInfo.phone', v)} />
          </span>
          <span className="text-gray-300">•</span>
          <span className="hover:text-black transition-colors px-1 underline underline-offset-4">
            <EditableText value={personalInfo.email} onSave={(v) => onSave('personalInfo.email', v)} />
          </span>
        </div>
      </header>

      {/* Summary */}
      <section style={{ marginBottom: 'var(--cv-gap)' }}>
        <h3 className="text-sm font-sans font-black border-b border-gray-200 uppercase tracking-[0.2em] text-gray-500 mb-2">
          Professional Summary
        </h3>
        <div className="italic text-gray-700">
          <EditableText 
            value={summary} 
            onSave={(v) => onSave('summary', v)} 
            multiline 
            className="text-[14px] leading-relaxed text-justify"
          />
        </div>
      </section>

      {/* Experience */}
      <section style={{ marginBottom: 'var(--cv-gap)' }}>
        <h3 className="text-sm font-sans font-black border-b border-gray-200 uppercase tracking-[0.2em] text-gray-500 mb-4">
          Professional Experience
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-gap)' }}>
          {experiences.map((item, idx) => (
            <div key={idx} className="group relative">
              {/* Delete Button */}
              <button 
                onClick={() => removeSectionItem('experiences', idx)}
                className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1.5 bg-white rounded-full shadow-sm border border-gray-100"
                title="Remove Experience"
              >
                <Trash2 size={14} />
              </button>

              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-[16px] flex gap-2">
                  <EditableText value={item.role} onSave={(v) => onSave(`experiences.${idx}.role`, v)} />
                  <span className="font-normal text-gray-400">at</span>
                  <EditableText value={item.company} onSave={(v) => onSave(`experiences.${idx}.company`, v)} />
                </h4>
                <span className="font-sans text-[11px] font-black text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  <EditableText value={item.duration} onSave={(v) => onSave(`experiences.${idx}.duration`, v)} />
                </span>
              </div>
              
              <div className="font-sans text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">
                <EditableText value={item.location} onSave={(v) => onSave(`experiences.${idx}.location`, v)} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-item-gap)' }}>
                {item.description.map((desc, j) => (
                  <div key={j} className="flex items-start gap-3 group/line">
                    <span className="text-black mt-1.5 text-[6px]">■</span>
                    <EditableText 
                      value={desc} 
                      onSave={(v) => {  
                        const newDesc = [...item.description];
                        newDesc[j] = v;
                        onSave(`experiences.${idx}.description`, newDesc);
                      }}
                      multiline 
                      className="text-[13px] leading-snug text-gray-800 flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section style={{ marginBottom: 'var(--cv-gap)' }}>
        <h3 className="text-sm font-sans font-black border-b border-gray-200 uppercase tracking-[0.2em] text-gray-500 mb-4">
          Education
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cv-item-gap)' }}>
          {education.map((edu, idx) => (
            <div key={idx} className="group relative flex justify-between items-start">
              <button 
                onClick={() => removeSectionItem('education', idx)}
                className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1.5 bg-white rounded-full shadow-sm border border-gray-100"
              >
                <Trash2 size={14} />
              </button>
              <div>
                <h4 className="font-bold text-[14px] uppercase tracking-tight">
                  <EditableText value={edu.degree} onSave={(v) => onSave(`education.${idx}.degree`, v)} />
                </h4>
                <p className="italic text-gray-600 text-[13px]">
                  <EditableText value={edu.school} onSave={(v) => onSave(`education.${idx}.school`, v)} />
                </p>
              </div>
              <p className="font-sans text-[11px] font-black text-gray-400">
                <EditableText value={edu.year} onSave={(v) => onSave(`education.${idx}.year`, v)} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Info */}
      <section 
        className="bg-gray-50 rounded-2xl border border-gray-100"
        style={{ padding: 'var(--cv-item-gap)' }}
      >
        <h3 className="text-sm font-sans font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
          Expertise & Skills
        </h3>
        <div className="grid grid-cols-1 gap-4 text-[13px]">
          <div className="flex flex-col gap-1">
            <span className="font-sans font-black uppercase text-[10px] text-gray-400">Core Expertise</span>
            <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              <EditableText 
                value={skillsArray.join(' • ')} 
                onSave={(v) => onSave('skills', v.split('•').map((s: string) => s.trim()))} 
                className="text-gray-900 font-bold"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="font-sans font-black uppercase text-[10px] text-gray-400">Languages</span>
              <EditableText 
                value={additionalInfo.languages.join(', ')} 
                onSave={(v) => onSave('additionalInfo.languages', v.split(',').map((s: string) => s.trim()))} 
                className="font-medium text-gray-800"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black uppercase text-[10px] text-gray-400">Interests</span>
              <EditableText 
                value={additionalInfo.interests.join(', ')} 
                onSave={(v) => onSave('additionalInfo.interests', v.split(',').map((s: string) => s.trim()))} 
                className="font-medium text-gray-800"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MinimalAts;