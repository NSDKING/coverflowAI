
export interface Experience {
  role: string;
  company: string;
  location: string;
  duration: string; // ex: "2020 - 2023" ou "Jan 2022 - Présent"
  description: string[]; // Toujours un tableau de puces (bullets)
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  year: string;
}

export interface AdditionalInfo {
  languages: string[];
  certifications: string[];
  interests: string[];
}

export interface CVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    photo?: string | null;
  };
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[]; // Format simple: ["React", "TypeScript", "Node.js"]
  additionalInfo: AdditionalInfo;
}

// Optionnel: Un type pour les templates qui ont besoin de niveaux (0-100%)
export interface SkillWithLevel {
  name: string;
  level: number; 
}