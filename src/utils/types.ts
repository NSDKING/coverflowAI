export interface CVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    photo?: string; // Optionnel car l'utilisateur peut ne pas en mettre
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
  

}

export interface ResumeData {
  name?: string;
  title?: string;
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
  };
  profileImage?: string;
  summary?: string;
  experience?: Array<{
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  education?: Array<{
    degree: string;
    school: string;
    period: string;
    honors?: string;
  }>;
  skills?: string[];
  additionalInfo?: {
    languages?: string;
    certificates?: string;
    awards?: string;
  };
}

export interface MinimalResumeData {
  name?: string;
  contactLine?: string;
  profileImage?: string;
  summary?: string;
  experience?: Array<{
    company: string;
    role: string;
    location: string;
    period: string;
    bullets: string[];
  }>;
  consultancy?: Array<{
    title: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  education?: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills?: {
    leadership?: string;
    frontEnd?: string;
    design?: string;
    interests?: string;
  };
}

export interface Education {
  date: string;
  institution: string;
  role: string;
  location: string;
  bullets?: string[];
}

export interface Experience {
  date: string;
  title: string;
  location: string;
  description: string;
  bullets?: string[];
}

export interface Skill {
  label: string;
  value: string;
}
 
