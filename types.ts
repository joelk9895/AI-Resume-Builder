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

export interface Template {
  id: string
  name: string
  className: string
}

