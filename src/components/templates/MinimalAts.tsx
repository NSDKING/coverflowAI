import { MinimalResumeData } from '@/utils/types';
import React from 'react';

 

interface MinimalAtsProps {
  data?: MinimalResumeData;
}

const MinimalAts: React.FC<MinimalAtsProps> = ({ data = {} }) => {
  // Destructuring with fallbacks based on the uploaded Edward Smith CV
  const {
    name = "Edward Smith",
    contactLine = "Market Street 12, New York | example@gmail.com | (412) 479-6342 | in/cbloomberg",
    profileImage = "/api/placeholder/128/128",
    summary = "Experienced and driven Financial Analyst with an impressive background of managing multi-million dollar budgets while providing analysis and account support within product development departments. Worked to reduce business expenses and develop logical and advantageous operating plan budgets.",
    experience = [
      {
        company: "Apple",
        role: "Engineer",
        location: "Cupertino, US",
        period: "May 2015 – Present",
        bullets: [
          "Created budgets and ensured that labor and material costs were decreased by 15 percent.",
          "Created financial reports on completed projects, indicating advantageous results.",
          "Generated financial statements including cash flow charts and balance sheets.",
          "Assessed new development projects generating over $4.5M in revenue."
        ]
      },
      {
        company: "GEO Corp.",
        role: "Engineer",
        location: "Berlin, Germany",
        period: "Oct. 2013 – Apr. 2015",
        bullets: [
          "Provide reports, ad-hoc analysis, annual operations plan budgets, and revenue forecasts.",
          "Analyzed supplier contracts and advised in negotiations bringing budgets down by 6%.",
          "Created weekly labor finance reports and presented the results to management."
        ]
      }
    ],
    consultancy = [
      {
        title: "Independant Startup Consultant",
        company: "Early-Stage Startup",
        period: "May 2015 – Present",
        bullets: [
          "Worked with 3 global founders to bring well-executed MVPs to market through no-code and 'ship-first' methodologies.",
          "Flashfeed, a media creation platform; SharedHomes, a rental platform; LV Global, international business consultancy."
        ]
      }
    ],
    education = [
      {
        degree: "Bachelor In Computer Engineering",
        school: "University Of Arizona",
        year: "2013"
      }
    ],
    skills = {
      leadership: "Speaking, Fundraising, Product Development, Communication, Partnerships, International Marketing",
      frontEnd: "HTML, CSS, Bootstrap, Webflow",
      design: "Photoshop, Illustrator, Sketch",
      interests: "Early-Stage Fundraising, Global Entrepreneurship, Web Design, Growth"
    }
  } = data;

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white p-10 font-serif text-gray-900 leading-tight print:my-0 print:p-8">
      {/* Header */}
      <header className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 overflow-hidden rounded-sm grayscale">
          <img src={profileImage} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-medium mb-1">{name}</h1>
          <p className="text-sm text-gray-600 tracking-wide">{contactLine}</p>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold border-b border-black mb-2 uppercase tracking-tighter">Professional Summary</h3>
        <p className="text-[13px] leading-relaxed text-gray-800">{summary}</p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold border-b border-black mb-4 uppercase tracking-tighter">Professional Experience</h3>
        <div className="space-y-6">
          {experience.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-[14px]">{item.company}, {item.role}, {item.location}</h4>
              </div>
              <p className="text-[12px] text-gray-500 italic mb-2">{item.period}</p>
              <ul className="list-disc ml-4 space-y-1">
                {item.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="text-[13px] text-gray-800">{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Consultancy */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold border-b border-black mb-4 uppercase tracking-tighter">Consultancy</h3>
        {consultancy.map((item, idx) => (
          <div key={idx}>
            <h4 className="font-bold text-[14px]">{item.title}, {item.company}</h4>
            <p className="text-[12px] text-gray-500 italic mb-2">{item.period}</p>
            <ul className="list-disc ml-4 space-y-1">
              {item.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="text-[13px] text-gray-800">{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold border-b border-black mb-3 uppercase tracking-tighter">Education</h3>
        {education.map((edu, idx) => (
          <div key={idx} className="flex justify-between items-baseline">
            <p className="text-[13px] font-bold text-gray-800">{edu.degree}, {edu.school}</p>
            <p className="text-[13px] text-gray-700">{edu.year}</p>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h3 className="text-lg font-semibold border-b border-black mb-3 uppercase tracking-tighter">Expert-Level Skills</h3>
        <div className="text-[13px] space-y-1">
          <p><span className="font-bold">Leadership:</span> {skills.leadership}</p>
          <p><span className="font-bold">Front End:</span> {skills.frontEnd} | <span className="font-bold">Design:</span> {skills.design}</p>
          <p><span className="font-bold">Fields of Interest:</span> {skills.interests}</p>
        </div>
      </section>
    </div>
  );
};

export default MinimalAts;