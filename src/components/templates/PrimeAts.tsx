import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ResumeData } from '@/utils/types';

/** * Interfaces for Type Safety 
 */

interface PrimeAtsProps {
  data?: ResumeData;
}

const PrimeAts: React.FC<PrimeAtsProps> = ({ data = {} }) => {
  // Destructuring with Herman Walton's data as the default fallback
  const {
    name = "Herman Walton",
    title = "Financial Analyst",
    contact = {
      address: "Market Street 12, New York, 1021, USA",
      phone: "(412) 479-6342",
      email: "example@gmail.com",
    },
    profileImage = "/api/placeholder/128/128",
    summary = "Experienced and driven Financial Analyst with an impressive background of managing multi-million dollar budgets while providing analysis and account support within product development departments. Worked to reduce business expenses and develop logical and advantageous operating plan budgets.",
    experience = [
      {
        role: "Financial Analyst",
        company: "GEO Corp.",
        period: "Jan 2012 — Present",
        bullets: [
          "Created budgets and ensured that labor and material costs were decreased by 15 percent.",
          "Created financial reports on completed projects, indicating advantageous results.",
          "Generated financial statements including cash flow charts and balance sheets.",
          "Introduced and implemented a different type of software to enhance communication."
        ]
      },
      {
        role: "Financial Analyst",
        company: "Sisco Enterprises",
        period: "Feb 2008 — Dec 2012",
        bullets: [
          "Provide reports, ad-hoc analysis, and annual operations plan budgets.",
          "Analyzed supplier contracts and advised in negotiations bringing budgets down by 6%.",
          "Created weekly labor finance reports and presented the results to management."
        ]
      }
    ],
    education = [
      {
        degree: "Diploma in Computer Engineering",
        school: "University of Arizona",
        period: "Aug 2006 — Oct 2008",
        honors: "Graduated with High Honors."
      },
      {
        degree: "Bachelor in Computer Engineering",
        school: "University of Arizona",
        period: "Aug 2004 — Oct 2006",
        honors: "Graduated with High Honors."
      }
    ],
    skills = [
      "Solution Strategies", "Analytical Thinker", "Innovation", "Agile Methodologies",
      "Effective Team leader", "Market Assessment", "Collaboration", "Creative Problem Solving",
      "Customer-centric Selling", "Trend Analysis", "Source Control", "Networking"
    ],
    additionalInfo = {
      languages: "English, French",
      certificates: "Financial Analyst License",
      awards: "Most Innovate Employer of the Year (2011), Overall Best Employee Division Two (2009)"
    }
  } = data;

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white shadow-lg border border-gray-200 font-sans text-gray-800 antialiased print:shadow-none print:my-0">
      {/* Header Section */}
      <header className="flex justify-between items-start p-8 border-b-2 border-blue-600">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-blue-700 uppercase tracking-tight">{name}</h1>
          <h2 className="text-2xl font-semibold mt-1 text-gray-700">{title}</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
            {contact?.address && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-600" /> {contact.address}</span>}
            {contact?.phone && <span className="flex items-center gap-1.5"><Phone size={14} className="text-blue-600" /> {contact.phone}</span>}
            {contact?.email && <span className="flex items-center gap-1.5"><Mail size={14} className="text-blue-600" /> {contact.email}</span>}
          </div>
        </div>
        <div className="ml-6 w-32 h-32 border border-gray-300 overflow-hidden rounded-sm flex-shrink-0">
          <img 
            src={profileImage} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Summary */}
        <section>
          <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wider text-left">Summary</h3>
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">{summary}</p>
        </section>

        {/* Professional Experience */}
        <section>
          <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-4 uppercase tracking-wider text-left">Professional Experience</h3>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg text-gray-900">{exp.role}, {exp.company}</h4>
                  <span className="text-sm font-bold text-gray-600 whitespace-nowrap">{exp.period}</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                  {exp.bullets.map((bullet, bIndex) => (
                    <li key={bIndex}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-4 uppercase tracking-wider text-left">Education</h3>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-700">{edu.school}</p>
                  {edu.honors && <p className="text-sm italic text-gray-500 mt-1">• {edu.honors}</p>}
                </div>
                <span className="text-sm font-bold text-gray-600 whitespace-nowrap">{edu.period}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section>
          <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-4 uppercase tracking-wider text-left">Technical Skills</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-700">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Additional Information */}
        <section>
          <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-3 uppercase tracking-wider text-left">Additional Information</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {additionalInfo?.languages && <li><span className="font-bold">• Languages:</span> {additionalInfo.languages}</li>}
            {additionalInfo?.certificates && <li><span className="font-bold">• Certificates:</span> {additionalInfo.certificates}</li>}
            {additionalInfo?.awards && <li><span className="font-bold">• Awards/Activities:</span> {additionalInfo.awards}</li>}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrimeAts;