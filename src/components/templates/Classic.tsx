import { Education, Experience, Skill } from '@/utils/types';
import React from 'react';

// --- Types ---
 

interface ResumeData {
  name?: string;
  title?: string;
  address?: string;
  phone?: string;
  email?: string;
  profile?: string;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  languages?: Skill[];
  hobbies?: string;
  birthDatePlace?: string;
  maritalStatus?: string;
  nationalityGender?: string;
}

// --- Default Data ---
const DEFAULT_DATA: Required<ResumeData> = {
  name: "Christopher Carter",
  title: "Accountant",
  address: "Budennovskij, 35, 344082, Rostov-on-Don – Rostov obl., Russia",
  phone: "+8-928-912-70-24",
  email: "shestakov@gmail.com",
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed metus a orci elementum luctus. Ut sit amet quam id ligula dignissim vestibulum. Fusce lobortis sagittis orci in porttitor. Sed metus nulla, rhoncus eu condimentum et, fringilla vitae nisl.",
  education: [
    { date: "01/09/2015 – 01/10/2015", institution: "British Design High School", role: "UX/UI courses, Participant", location: "Moscow, Russia" },
    { date: "01/09/2010 – 29/05/2014", institution: "Institute of Art & Design", role: "Master, Top level", location: "Rostov-on-Don, Russia", bullets: ["Lorem ipsum dolor sit amet, consectetur.", "Cras sed metus a orci elementum luctus."] }
  ],
  experience: [
    { date: "May 2015 – Present time", title: "UX designer, Pentagram Group", location: "Moscow, Russia", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", bullets: ["Lorem ipsum dolor sit amet.", "Cras sed metus a orci elementum."] },
    { date: "Oct. 2013 – Apr. 2015", title: "Graphic designer, Grizzly Agency", location: "Rostov-on-Don, Russia", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  ],
  skills: [
    { label: "UX/UI", value: "Perfectly" },
    { label: "Front-end development", value: "Good" },
    { label: "Branding & Identity", value: "Very good" },
    { label: "Wayfinding systems", value: "Good" }
  ],
  languages: [
    { label: "English", value: "Perfectly" },
    { label: "Russian", value: "Good" }
  ],
  hobbies: "Swimming, Watching TV shows, 3D printing, Skateboarding",
  birthDatePlace: "04/07/1969, Rostov-on-Don, Russia",
  maritalStatus: "Married",
  nationalityGender: "Russian / Male"
};

const Classic = ({ data = {} }: { data?: ResumeData }) => {
  // Merge incoming data with defaults
  const d = { ...DEFAULT_DATA, ...data };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 font-serif text-gray-800">
      <div className="max-w-[850px] mx-auto bg-white p-12 shadow-lg min-h-[1100px]">
        
        {/* Header */}
        <header className="text-center mb-8 border-b border-gray-300 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight uppercase mb-2">
            {d.name}, {d.title}
          </h1>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{d.address}</p>
            <p>{d.phone} — <span className="underline">{d.email}</span></p>
          </div>
        </header>

        <Section title="PROFILE">
          <p className="text-sm leading-relaxed text-justify">{d.profile}</p>
        </Section>

        <Section title="EDUCATION">
          <div className="space-y-6">
            {(d.education ?? DEFAULT_DATA.education).map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div className="w-1/3 text-xs text-gray-500">{edu.date}</div>
                <div className="w-2/3">
                  <h3 className="font-bold text-sm">{edu.institution}</h3>
                  <p className="text-xs italic text-gray-600">{edu.role}</p>
                  <p className="text-xs mt-1 text-right text-gray-400">{edu.location}</p>
                  {edu.bullets && (
                    <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                      {edu.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="EXPERIENCE">
          <div className="space-y-8">
            {(d.experience ?? DEFAULT_DATA.experience).map((job, i) => (
              <div key={i} className="flex justify-between items-start">
                <div className="w-1/3 text-xs text-gray-500 italic">{job.date}</div>
                <div className="w-2/3">
                  <h3 className="font-bold text-sm">{job.title}</h3>
                  <p className="text-xs mt-1 text-right text-gray-400">{job.location}</p>
                  <p className="text-xs mt-2 leading-relaxed">{job.description}</p>
                  {job.bullets && (
                    <ul className="list-disc list-inside text-xs mt-2">
                      {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="SKILLS" subtitle="In decreasing order">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
            {(d.skills ?? DEFAULT_DATA.skills).map((s, i) => (
              <SkillRow key={i} label={s.label} value={s.value} />
            ))}
          </div>
        </Section>

        <Section title="LANGUAGES" subtitle="In decreasing order">
          <div className="grid grid-cols-2 gap-x-8 text-xs">
             {(d.languages ?? DEFAULT_DATA.languages).map((l, i) => (
              <SkillRow key={i} label={l.label} value={l.value} />
            ))}
          </div>
        </Section>

        <Section title="HOBBIES">
          <p className="text-xs">{d.hobbies}</p>
        </Section>

        {/* Footer Meta */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-[10px] grid grid-cols-2 gap-y-2 uppercase tracking-wider text-gray-500">
          <FooterItem label="Date / Place of birth" value={d.birthDatePlace} isRightBorder />
          <FooterItem label="Marital status" value={d.maritalStatus} />
          <FooterItem label="Nationality / Gender" value={d.nationalityGender} isRightBorder />
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const Section = ({ title, subtitle, children }: { title: string, subtitle?: string, children: React.ReactNode }) => (
  <div className="flex mb-8 border-t border-gray-200 pt-4">
    <div className="w-1/4 pr-4">
      <h2 className="text-xs font-bold tracking-widest uppercase">{title}</h2>
      {subtitle && <p className="text-[10px] text-gray-400 mt-1 italic">{subtitle}</p>}
    </div>
    <div className="w-3/4">{children}</div>
  </div>
);

const SkillRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between border-b border-gray-100 py-1">
    <span>{label}</span>
    <span className="text-gray-400 italic">{value}</span>
  </div>
);

const FooterItem = ({ label, value, isRightBorder }: { label: string, value: string, isRightBorder?: boolean }) => (
  <div className={`flex justify-between px-4 ${isRightBorder ? 'border-r border-gray-100 pr-8' : 'pl-8'}`}>
    <span>{label}</span>
    <span className="text-gray-800 text-right whitespace-pre-line">{value}</span>
  </div>
);

export default Classic;