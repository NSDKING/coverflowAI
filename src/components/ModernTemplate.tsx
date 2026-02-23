import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface TemplateProps {
  data: any; // On utilisera l'objet JSON extrait par l'IA
  profileImage?: string; // L'image pro générée par l'IA plus tard
}

export default function ModernTemplate({ data, profileImage }: TemplateProps) {
  if (!data) return null;

  return (
    <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg mx-auto p-10 font-sans text-slate-800 print:shadow-none print:p-0" id="resume-template">
      {/* HEADER */}
      <header className="flex justify-between items-start border-b-2 border-blue-600 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
            {data.personalInfo?.fullName}
          </h1>
          <p className="text-xl text-blue-600 font-semibold italic">
            {data.personalInfo?.jobTitle}
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-sm text-slate-600">
            {data.personalInfo?.email && <span className="flex items-center gap-1"><Mail size={14} /> {data.personalInfo.email}</span>}
            {data.personalInfo?.phone && <span className="flex items-center gap-1"><Phone size={14} /> {data.personalInfo.phone}</span>}
            {data.personalInfo?.location && <span className="flex items-center gap-1"><MapPin size={14} /> {data.personalInfo.location}</span>}
          </div>
        </div>
        
        {/* Photo Slot - Sera utilisé par ton IA Image plus tard */}
        {profileImage && (
          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <div className="grid grid-cols-3 gap-10 mt-8">
        {/* LEFT COLUMN (SIDEBAR) */}
        <aside className="col-span-1 space-y-8">
          <section>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Formation</h2>
            <div className="space-y-4">
              {data.education?.map((edu: any, i: number) => (
                <div key={i}>
                  <p className="font-bold text-sm">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.school}</p>
                  <p className="text-xs text-blue-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* RIGHT COLUMN (MAIN CONTENT) */}
        <main className="col-span-2 space-y-8">
          <section>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Expériences Professionnelles</h2>
            <div className="space-y-6">
              {data.experiences?.map((exp: any, i: number) => (
                <div key={i} className="relative pl-4 border-l border-slate-200">
                  <div className="absolute w-2 h-2 bg-blue-600 rounded-full -left-[4.5px] top-1.5" />
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-lg">{exp.role}</h3>
                    <span className="text-xs font-bold text-slate-400">{exp.duration}</span>
                  </div>
                  <p className="text-blue-600 text-sm font-medium mb-2">{exp.company}</p>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {exp.description?.map((item: string, j: number) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}