import React from 'react';
import { CVData } from '@/utils/types';
import PrimeAts from './templates/PrimeAts';
import MinimalAts from './templates/MinimalAts';
import Classic from './templates/Classic';
import Professional from './templates/Professional';
 
interface CVRendererProps {
  data: CVData;
  templateId: string;
  profileImage?: string;
}

export default function CVRenderer({ data, templateId, profileImage }: CVRendererProps) {
  if (!data) return null;

  /**
   * 1. THE TRANSFORMER
   * This object spreads the original data AND adds the specific 
   * fields required by different templates to satisfy TypeScript.
   */
  const formattedData = {
    ...data, // Spreads personalInfo, summary, experiences, skills, education
    
    // Flattened aliases for templates like PrimeAts/MinimalAts
    name: data.personalInfo?.fullName,
    title: data.personalInfo?.jobTitle,
    profileImage: profileImage || data.personalInfo?.photo,
    
    contact: {
      address: data.personalInfo?.location,
      phone: data.personalInfo?.phone,
      email: data.personalInfo?.email,
    },
    
    contactLine: `${data.personalInfo?.location} | ${data.personalInfo?.email} | ${data.personalInfo?.phone}`,

    // Experience mapping to satisfy MinimalAts (needs location/period/bullets)
    experience: data.experiences?.map(exp => ({
      ...exp,
      title: exp.role,
      period: exp.duration,
      date: exp.duration,
      location: "", // Required by MinimalAts
      bullets: exp.description, // Required by MinimalAts
      description: Array.isArray(exp.description) ? exp.description.join(" ") : exp.description
    })),

    // Education mapping to satisfy PrimeAts/MinimalAts
    education: data.education?.map(edu => ({
      ...edu,
      institution: edu.school,
      period: edu.year,
      date: edu.year,
      location: "" // Added for safety
    })),

    // Skills mapping for templates expecting objects or strings
    skillsList: data.skills?.map(skill => ({ name: skill, label: skill, value: "80%" })),
    
    minimalSkills: {
      leadership: data.skills?.slice(0, 3).join(", ") || "N/A",
      frontEnd: data.skills?.slice(3, 6).join(", ") || "N/A",
      design: "N/A",
      interests: "Innovation"
    }
  };

  /**
   * 2. THE RENDERER
   */
  const renderTemplate = () => {
    switch (templateId) {
      case 'modern':
        // Uses the standard CVData properties (...data)
        return <Professional data={formattedData as any} />;

      case 'minimal':
        return (
          <MinimalAts 
            data={{
              ...formattedData,
              skills: formattedData.minimalSkills // Minimal expects this specific shape
            } as any} 
          />
        );

      case 'classic':
        return (
          <Classic 
            data={{
              ...formattedData,
              skills: formattedData.skillsList,
              languages: [{ label: "English", value: "Fluent" }],
              birthDatePlace: "",
              maritalStatus: "",
              nationalityGender: ""
            } as any}
          />
        );

      case 'professional':
        return <Professional data={formattedData as any} />;

      case 'prime-ats':
        return <PrimeAts data={formattedData as any} />;

      default:
        return (
          <div className="p-20 bg-white text-slate-900 text-center">
            <h2 className="text-xl font-bold">Template Not Found</h2>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex justify-center overflow-hidden">
      <div className="bg-white shadow-2xl">
        {renderTemplate()}
      </div>
    </div>
  );
}