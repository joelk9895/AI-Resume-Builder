export interface Education {
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface WorkExperience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface Project {
  title: string
  description: string
  technologies: string[]
  link?: string
}

export interface Template {
  id: string
  name: string
  className: string
}

export interface CVData {
  personalDetails: {
    firstName: string
    lastName: string
    jobTitle: string
    email: string
    phone: string
    address: string
    profilePhoto?: string
  }
  summary: string
  education: Education[]
  workExperience: WorkExperience[]
  languages: string[]
  interests: string[]
  keyProjects: Project[]
  skills: string[]
}

export interface ResumeQuestion {
  id: string;
  text: string;
  section: string;
  placeholder: string;
}

export const RESUME_QUESTIONS: ResumeQuestion[] = [
  {
    id: 'name',
    text: "What's your full name?",
    section: 'personal',
    placeholder: '[YOUR NAME]'
  },
  {
    id: 'title',
    text: "What's your professional title?",
    section: 'personal',
    placeholder: '[Your Title]'
  },
  {
    id: 'email',
    text: "What's your email address?",
    section: 'personal',
    placeholder: '[YOUR EMAIL]'
  },
  {
    id: 'phone',
    text: "What's your phone number?",
    section: 'personal',
    placeholder: '[Your Phone]'
  },
  {
    id: 'location',
    text: "Where are you located? (City, State)",
    section: 'personal',
    placeholder: '[Your Location]'
  },
  {
    id: 'summary',
    text: "Write a brief professional summary about yourself",
    section: 'summary',
    placeholder: '[Your professional summary]'
  },
  {
    id: 'experience',
    text: "Let's add your work experience. What's your most recent job title, company, and duration?",
    section: 'experience',
    placeholder: '[Add your work experience]'
  },
  {
    id: 'education',
    text: "What's your educational background? Include degree, institution, and graduation year",
    section: 'education',
    placeholder: '[Add your education]'
  },
  {
    id: 'skills',
    text: "List your key professional skills (comma separated)",
    section: 'skills',
    placeholder: '[Add your skills]'
  }
]

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // URL to preview image
  template: string; // The HTML template
  category: 'Professional' | 'Creative' | 'Simple' | 'Modern';
} 