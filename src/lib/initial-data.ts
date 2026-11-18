import { IProfile, IProject, ISkill, ITimeline, IWebsiteSettings } from "@/types";

export const initialProfile: IProfile = {
  name: "Siddhesh Korade",
  titles: [
    "MERN Stack Developer",
    "Full-Stack Web Developer",
    "React.js Developer",
    "Next.js (Learning Phase)"
  ],
  heroBio: "Passionate MERN Stack & Full-Stack Web Developer (Fresher). Specializing in React.js, Node.js, Express, and MongoDB, actively learning Next.js.",
  aboutBio: "Hi, I'm Siddhesh Korade, a dedicated MERN Stack & Full-Stack Web Developer (Fresher). I specialize in building responsive, modern web applications using React.js, Node.js, Express.js, and MongoDB, and I am currently in the learning phase of Next.js to expand my full-stack capabilities. With a Data Science internship at Webisoftech and hands-on project experience, I am seeking entry-level developer opportunities where I can contribute and grow.",
  location: "Kolhapur, Maharashtra, India",
  email: "siddheshkorade10@gmail.com",
  phone: "+91 8261825954",
  githubUrl: "https://github.com/siddheshkorade",
  linkedinUrl: "https://linkedin.com/in/siddheshkorade",
  resumeUrl: "/resume.pdf",
  isOpenToWork: true,
  yearsOfExperience: "Fresher",
  projectsCompleted: "MERN Stack"
};

export const initialProjects: IProject[] = [
  {
    title: "AI Interview Simulator",
    subtitle: "Gen-AI Intelligent Preparation Platform",
    description: "An AI-driven platform that generates dynamic, role-specific interview questions by parsing candidates' resumes and job descriptions using Google Gemini API.",
    longDescription: "Engineered an AI-driven interview preparation system with automated resume parsing, real-time evaluation feedback, and low-latency interaction. Built with a responsive React/Vite interface and robust Node.js backend managing complex state transitions and streaming API integrations.",
    thumbnail: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
    category: "AI / Gen-AI",
    technologies: ["MERN Stack", "Gemini API", "React.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    features: [
      "Dynamic AI interview generation based on custom resume & JD uploads",
      "Real-time evaluation and score breakdowns across technical domains",
      "Low-latency response handling with intelligent prompt optimization",
      "Secure user authentication and mock interview history tracking"
    ],
    githubUrl: "https://github.com/siddheshkorade/ai-interview-simulator",
    liveUrl: "https://ai-interview-simulator.example.com",
    isFeatured: true,
    isPublished: true,
    order: 1
  },
  {
    title: "IT Universe E-Commerce",
    subtitle: "Hardware & Tech Components E-Commerce Platform",
    description: "An end-to-end e-commerce platform for computer hardware, laptops, and peripherals with persistent shopping cart, inventory management, and secure checkout.",
    longDescription: "Developed a comprehensive full-stack e-commerce web platform for IT hardware. Features dynamic product filtering, persistent cart storage, safe transactional order pipelines, and an intuitive user experience geared toward high conversion rates.",
    thumbnail: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)",
    category: "Full Stack",
    technologies: ["JavaScript", "Python (Flask)", "MySQL", "Node.js", "REST APIs", "Tailwind CSS"],
    features: [
      "Dynamic product catalog with multi-facet filtering and real-time search",
      "Persistent session carts with guest and authenticated sync",
      "Secure inventory and order management system with transactional integrity",
      "Optimized responsive UI for mobile, tablet, and desktop shoppers"
    ],
    githubUrl: "https://github.com/siddheshkorade/it-universe-ecommerce",
    liveUrl: "https://it-universe.example.com",
    isFeatured: true,
    isPublished: true,
    order: 2
  },
  {
    title: "Full-Stack Developer Portfolio",
    subtitle: "Personal Portfolio & Content Management System",
    description: "A production-grade developer portfolio featuring a dark futuristic theme, glassmorphism cards, interactive components, and a private admin management dashboard.",
    longDescription: "Developed a showcase web application featuring responsive glassmorphic cards, contact messaging, and a private admin panel for content management, built with modern JavaScript and React.",
    thumbnail: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)",
    category: "Full Stack",
    technologies: ["React.js", "Node.js", "MongoDB", "Tailwind CSS", "Next.js (Learning Phase)"],
    features: [
      "Responsive glassmorphism UI with dark futuristic styling",
      "Private admin dashboard for managing projects, skills, and messages",
      "Contact messaging form with server-side validation and spam rate-limiting",
      "Clean architecture with dual database and in-memory persistence"
    ],
    githubUrl: "https://github.com/siddheshkorade/portfolio",
    liveUrl: "https://siddheshkorade.dev",
    isFeatured: true,
    isPublished: true,
    order: 3
  }
];

export const initialSkills: ISkill[] = [
  // Frontend
  { name: "React.js", category: "Frontend", proficiency: 92, order: 1, isEnabled: true },
  { name: "Next.js (Learning Phase)", category: "Frontend", proficiency: 50, order: 2, isEnabled: true },
  { name: "JavaScript (ES7+)", category: "Frontend", proficiency: 95, order: 3, isEnabled: true },
  { name: "Tailwind CSS", category: "Frontend", proficiency: 94, order: 4, isEnabled: true },
  { name: "HTML5 & CSS3", category: "Frontend", proficiency: 96, order: 5, isEnabled: true },
  { name: "Redux Toolkit", category: "Frontend", proficiency: 85, order: 6, isEnabled: true },
  { name: "Context API", category: "Frontend", proficiency: 90, order: 7, isEnabled: true },
  { name: "Vite", category: "Frontend", proficiency: 90, order: 8, isEnabled: true },

  // Backend
  { name: "Node.js", category: "Backend", proficiency: 90, order: 9, isEnabled: true },
  { name: "Express.js", category: "Backend", proficiency: 92, order: 10, isEnabled: true },
  { name: "REST APIs", category: "Backend", proficiency: 94, order: 11, isEnabled: true },
  { name: "JWT Authentication", category: "Backend", proficiency: 92, order: 12, isEnabled: true },
  { name: "Socket.IO", category: "Backend", proficiency: 84, order: 13, isEnabled: true },
  { name: "API Integration", category: "Backend", proficiency: 92, order: 14, isEnabled: true },

  // Database
  { name: "MongoDB", category: "Database", proficiency: 92, order: 15, isEnabled: true },
  { name: "Mongoose ODM", category: "Database", proficiency: 90, order: 16, isEnabled: true },
  { name: "MySQL", category: "Database", proficiency: 85, order: 17, isEnabled: true },

  // Tools & Security
  { name: "Python", category: "Tools & Security", proficiency: 84, order: 18, isEnabled: true },
  { name: "Git & GitHub", category: "Tools & Security", proficiency: 92, order: 19, isEnabled: true },
  { name: "Postman", category: "Tools & Security", proficiency: 90, order: 20, isEnabled: true },
  { name: "Vercel", category: "Tools & Security", proficiency: 92, order: 21, isEnabled: true },
  { name: "VS Code", category: "Tools & Security", proficiency: 96, order: 22, isEnabled: true },
  { name: "CORS & Web Security", category: "Tools & Security", proficiency: 88, order: 23, isEnabled: true }
];

export const initialTimeline: ITimeline[] = [
  {
    type: "Internship",
    title: "Data Science Intern",
    organization: "Webisoftech",
    period: "2023 – 2024",
    duration: "Internship",
    description: "Analyzed and preprocessed datasets using Python, Pandas, and NumPy to extract meaningful insights. Performed EDA and data visualizations with Matplotlib & Seaborn. Built and evaluated machine learning models using classification and regression algorithms.",
    highlights: [
      "Extracted meaningful patterns from complex datasets with Pandas & NumPy",
      "Created intuitive exploratory visualizations using Matplotlib & Seaborn",
      "Engineered and evaluated predictive models for practical analytical tasks"
    ],
    order: 1
  },
  {
    type: "Certification",
    title: "MERN Stack Specialization",
    organization: "Oak Academy (Udemy)",
    period: "2023",
    duration: "Certified Specialization",
    description: "Comprehensive hands-on training in developing scalable full-stack applications with MongoDB, Express.js, React, and Node.js, focusing on NoSQL schemas and server-side security protocols.",
    order: 2
  }
];

export const initialSettings: IWebsiteSettings = {
  siteTitle: "Siddhesh Korade | MERN Stack & Full-Stack Developer",
  siteDescription: "Portfolio of Siddhesh Korade - MERN Stack Developer, React.js, Node.js, and Full-Stack Web Developer.",
  contactEmail: "siddheshkorade10@gmail.com",
  accentColor: "#8b5cf6",
  enable3DEffects: true,
  enableCustomCursor: true,
  resumeFileName: "Siddhesh_Korade_Resume.pdf"
};
