import React from 'react';

/** * TYPES DEFINITION
 */
export interface Reference {
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    photo?: string; 
  };
  summary?: string;
  experiences: Array<{
    role: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  skills: string[];
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  references?: Reference[];
}

/**
 * DEFAULT DATA (Sophie Walton Fallback)
 */
const DEFAULT_DATA: CVData = {
  personalInfo: {
    fullName: "Sophie Walton",
    jobTitle: "Customer Service Representative",
    email: "hw12@yahoo.com",
    phone: "(206) 742-5187",
    location: "32600 42nd Ave SW, Seattle, WA 98116",
    photo: "https://i.pravatar.cc/150?u=sophie" 
  },
  summary: "Dedicated Customer Service Representative dedicated to providing quality care for ultimate customer satisfaction. Proven ability to establish and maintain excellent communication and relationships with clients. Adept in general accounting and finance transactions.",
  experiences: [
    {
      role: "Branch Customer Service Representative",
      company: "AT&T Inc., Seattle",
      duration: "AUGUST 2014 — SEPTEMBER 2019",
      description: [
        "Maintained up to date knowledge of products and services.",
        "Handled customer calls and responded to queries about services, product malfunctions, promotions, and billing.",
        "Worked to address all customer concerns in a timely and effective manner."
      ]
    }
  ],
  skills: ["Excellent Communication Skills", "Troubleshooting Skills", "Multitasking Skills", "Mediation and Negotiation Skills", "Marketing Strategies"],
  education: [
    {
      degree: "Bachelor of Communications",
      school: "University of Seattle, Seattle",
      year: "AUGUST 2007 — MAY 2011"
    }
  ],
  references: [
    { name: "Marissa Leeds", company: "Gold Coast Hotel", email: "mleeds@goldcoast.com", phone: "732-189-0909" },
    { name: "George Kenny", company: "AT&T", email: "gkenny@att.com", phone: "888-897-0221" }
  ]
};

/**
 * COMPONENT
 */
const Professional = ({ data }: { data?: CVData }) => {
  const d = data ?? DEFAULT_DATA;

  return (
    <div className="bg-zinc-100 min-h-screen py-10 flex justify-center font-sans antialiased">
      <div className="w-[850px] bg-white shadow-2xl flex min-h-[1100px]">
        
        {/* LEFT SIDEBAR - DARK GREEN */}
        <aside className="w-[33%] bg-[#064e3b] text-white flex flex-col pt-12">
          {/* Header/Photo Section */}
          <div className="flex flex-col items-center px-8 mb-10">
            {d.personalInfo.photo && (
              <div className="w-28 h-28 rounded-full border-2 border-white/20 overflow-hidden mb-6">
                <img src={d.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-center tracking-tight mb-2">
              {d.personalInfo.fullName}
            </h1>
            <div className="w-8 h-[1px] bg-white/40 mb-3" />
            <p className="text-[10px] uppercase tracking-[0.25em] text-center text-emerald-100/80 leading-relaxed px-4">
              {d.personalInfo.jobTitle}
            </p>
          </div>

          {/* Details & Skills */}
          <div className="px-8 space-y-10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-1">Details</h3>
              <div className="text-[11px] text-emerald-50 space-y-3 leading-relaxed">
                <p className="whitespace-pre-line">{d.personalInfo.location}</p>
                <p>{d.personalInfo.phone}</p>
                <p className="underline truncate block">{d.personalInfo.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-1">Skills</h3>
              <div className="space-y-4">
                {d.skills.map((skill, i) => (
                  <div key={i}>
                    <p className="text-[10px] mb-2">{skill}</p>
                    <div className="h-[2px] bg-white/10 w-full relative">
                      <div className="absolute left-0 top-0 h-full bg-white w-[85%]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT - MAIN */}
        <main className="w-[67%] p-12 text-slate-800">
          <Section title="Profile">
            <p className="text-xs leading-6 text-slate-600 text-justify">{d.summary}</p>
          </Section>

          <Section title="Employment History">
            <div className="space-y-8">
              {d.experiences.map((exp, i) => (
                <div key={i}>
                  <h3 className="text-sm font-bold text-slate-900">{exp.role}, {exp.company}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 mb-3">{exp.duration}</p>
                  <ul className="list-disc ml-4 space-y-2">
                    {exp.description.map((bullet, j) => (
                      <li key={j} className="text-xs text-slate-600 pl-1 leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Education">
            <div className="space-y-6">
              {d.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="text-sm font-bold text-slate-900">{edu.degree}, {edu.school}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{edu.year}</p>
                </div>
              ))}
            </div>
          </Section>

          {d.references && d.references.length > 0 && (
            <Section title="References">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {d.references.map((ref, i) => (
                  <div key={i} className="text-xs">
                    <p className="font-bold text-slate-900">{ref.name} from {ref.company}</p>
                    <p className="text-slate-500 mt-1">{ref.email} | {ref.phone}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </main>

      </div>
    </div>
  );
};

// Helper Section component
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1.5 mb-4">{title}</h2>
    {children}
  </section>
);

export default Professional;