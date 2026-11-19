export interface IProfile {
  _id?: string;
  name: string;
  titles: string[]; // e.g. ["Full-Stack Developer", "MERN Stack Developer", "Next.js Specialist"]
  heroBio: string;
  aboutBio: string;
  location: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  avatarUrl?: string;
  isOpenToWork: boolean;
  yearsOfExperience: string;
  projectsCompleted: string;
}

export interface IProject {
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  category: "MERN Stack" | "Next.js" | "React.js" | "Full Stack" | "AI / Gen-AI" | "Other";
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  isFeatured: boolean;
  isHighlighted: boolean;
  isPublished: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SkillCategory = "Frontend" | "Backend" | "Database" | "Tools & Security";

export interface ISkill {
  _id?: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  iconName?: string;
  order: number;
  isEnabled: boolean;
}

export type TimelineType = "Internship" | "Work" | "Education" | "Certification" | "Achievement";

export interface ITimeline {
  _id?: string;
  type: TimelineType;
  title: string; // e.g. "Data Science Intern", "Master of Computer Applications (M.C.A.)"
  organization: string; // e.g. "Webisoftech", "Vivekanand College, Kolhapur"
  period: string; // e.g. "2024 – 2026", "2023"
  duration?: string; // e.g. "2 Years", "3 Months"
  grade?: string; // e.g. "66.30%", "CGPA: 7.5 / 10"
  description: string;
  highlights?: string[];
  order: number;
}

export interface IContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface IWebsiteSettings {
  _id?: string;
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  accentColor: string;
  enable3DEffects: boolean;
  enableCustomCursor: boolean;
  resumeFileName: string;
}
