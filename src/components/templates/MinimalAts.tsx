'use client';

import React from 'react';
import { CVData } from '@/utils/types';
import EditableText from '../EditableText';

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

  const skillsArray = Array.isArray(skills) ? skills : [];

  return (
    <div className="w-[210mm] min-h-[297mm] mx-auto bg-white p-16 font-serif text-gray-900 leading-tight shadow-sm transition-all duration-300">
      {/* Header */}
      <header className="flex flex-col items-center text-center border-b-2 border-black pb-8 mb-10">
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
      <section className="mb-12">
        <h3 className="text-sm font-sans font-black border-b border-gray-200 mb-4 uppercase tracking-[0.2em] text-gray-500">Professional Summary</h3>
        <div className="p-2 hover:bg-gray-50 rounded-lg transition-all italic text-gray-700">
          <EditableText 
            value={summary} 
            onSave={(v) => onSave('summary', v)} 
            multiline 
            className="text-[14px] leading-relaxed text-justify"
          />
        </div>
      </section>

      {/* Experience */}
      <section className="mb-12">
        <h3 className="text-sm font-sans font-black border-b border-gray-200 mb-6 uppercase tracking-[0.2em] text-gray-500">Professional Experience</h3>
        <div className="space-y-10">
          {experiences.map((item, idx) => (
            <div key={idx} className="group relative">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-[16px] flex gap-2">
                  <EditableText value={item.role} onSave={(v) => onSave(`experiences.${idx}.role`, v)} />
                  <span className="font-normal text-gray-400">at</span>
                  <EditableText value={item.company} onSave={(v) => onSave(`experiences.${idx}.company`, v)} />
                </h4>
                <span className="font-sans text-[11px] font-black text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  <EditableText value={item.duration} onSave={(v) => onSave(`experiences.${idx}.duration`, v)} />
                </span>
              </div>
              
              <div className="font-sans text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-4">
                <EditableText value={item.location} onSave={(v) => onSave(`experiences.${idx}.location`, v)} />
              </div>

              <div className="space-y-2">
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
                      className="text-[13px] leading-snug text-gray-800 flex-1 hover:text-black transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-12">
        <h3 className="text-sm font-sans font-black border-b border-gray-200 mb-6 uppercase tracking-[0.2em] text-gray-500">Education</h3>
        <div className="space-y-6">
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-start hover:bg-gray-50 p-2 rounded transition-colors">
              <div>
                <h4 className="font-bold text-[14px] uppercase tracking-tight">
                  <EditableText value={edu.degree} onSave={(v) => onSave(`education.${idx}.degree`, v)} />
                </h4>
                <p className="italic text-gray-600 text-[13px] mt-1">
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
      <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
        <h3 className="text-sm font-sans font-black mb-6 uppercase tracking-[0.2em] text-gray-500">Expertise & Skills</h3>
        <div className="grid grid-cols-1 gap-6 text-[13px]">
          <div className="flex flex-col gap-2">
            <span className="font-sans font-black uppercase text-[10px] text-gray-400">Core Expertise</span>
            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <EditableText 
                value={skillsArray.join(' • ')} 
                onSave={(v) => onSave('skills', v.split('•').map((s: string) => s.trim()))} 
                className="text-gray-900 font-bold"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-sans font-black uppercase text-[10px] text-gray-400">Languages</span>
              <EditableText 
                value={additionalInfo.languages.join(', ')} 
                onSave={(v) => onSave('additionalInfo.languages', v.split(',').map((s: string) => s.trim()))} 
                className="font-medium text-gray-800"
              />
            </div>
            <div className="flex flex-col gap-2">
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