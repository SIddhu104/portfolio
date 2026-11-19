import { connectDB } from "./db";
import { Profile } from "@/models/Profile";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { Timeline } from "@/models/Timeline";
import { ContactMessage } from "@/models/ContactMessage";
import { WebsiteSettings } from "@/models/WebsiteSettings";
import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialTimeline,
  initialSettings,
} from "./initial-data";
import { IProfile, IProject, ISkill, ITimeline, IWebsiteSettings, IContactMessage } from "@/types";

// In-memory fallback stores when MongoDB is not connected
let memoryProfile: IProfile = { ...initialProfile };
let memoryProjects: IProject[] = initialProjects.map((p, idx) => ({ ...p, _id: `mem_proj_${idx}` }));
let memorySkills: ISkill[] = initialSkills.map((s, idx) => ({ ...s, _id: `mem_skill_${idx}` }));
let memoryTimeline: ITimeline[] = initialTimeline.map((t, idx) => ({ ...t, _id: `mem_time_${idx}` }));
let memorySettings: IWebsiteSettings = { ...initialSettings };
let memoryMessages: IContactMessage[] = [
  {
    _id: "msg_sample_1",
    name: "Alex Rivera",
    email: "alex@techstart.io",
    subject: "Full-Stack Opportunity",
    message: "Hi Siddhesh, impressed by your AI Interview Simulator and MERN stack work. We have an open position for a Full-Stack Developer and would love to chat!",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

let hasSeeded = false;

export async function ensureDatabaseSeeded() {
  const db = await connectDB();
  if (!db || hasSeeded) return;

  try {
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(initialProfile);
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(initialProjects);
    }

    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(initialSkills);
    }

    const timelineCount = await Timeline.countDocuments();
    if (timelineCount === 0) {
      await Timeline.insertMany(initialTimeline);
    }

    const settingsCount = await WebsiteSettings.countDocuments();
    if (settingsCount === 0) {
      await WebsiteSettings.create(initialSettings);
    }

    hasSeeded = true;
  } catch (err) {
    console.warn("Auto-seed info:", err instanceof Error ? err.message : err);
  }
}

// ----------------------------------------------------
// Public & Data Fetching APIs
// ----------------------------------------------------

export async function getProfileData(): Promise<IProfile> {
  const db = await connectDB();
  if (db) {
    await ensureDatabaseSeeded();
    const doc = await Profile.findOne().lean();
    if (doc) return JSON.parse(JSON.stringify(doc));
  }
  return memoryProfile;
}

export async function updateProfileData(data: Partial<IProfile>): Promise<IProfile> {
  const normalizedData = { ...data };
  if (Array.isArray(normalizedData.titles)) {
    normalizedData.titles = normalizedData.titles
      .filter((title): title is string => typeof title === "string")
      .map((title) => title.trim())
      .filter(Boolean);
  }
  const db = await connectDB();
  if (db) {
    const updated = await Profile.findOneAndUpdate({}, { $set: normalizedData }, { new: true, upsert: true }).lean();
    return JSON.parse(JSON.stringify(updated));
  }
  memoryProfile = { ...memoryProfile, ...normalizedData };
  return memoryProfile;
}

export async function getProjectsData(onlyPublished = true): Promise<IProject[]> {
  const db = await connectDB();
  if (db) {
    await ensureDatabaseSeeded();
    const query = onlyPublished ? { isPublished: true } : {};
    const docs = await Project.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  }
  const projs = onlyPublished ? memoryProjects.filter((p) => p.isPublished) : memoryProjects;
  return projs.sort((a, b) => a.order - b.order);
}

export async function getProjectById(id: string): Promise<IProject | null> {
  const db = await connectDB();
  if (db) {
    const doc = await Project.findById(id).lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  }
  return memoryProjects.find((p) => p._id === id) || null;
}

export async function createProject(data: Partial<IProject>): Promise<IProject> {
  const db = await connectDB();
  if (db) {
    const doc = await Project.create(data);
    return JSON.parse(JSON.stringify(doc));
  }
  const newProj: IProject = {
    _id: `mem_proj_${Date.now()}`,
    title: data.title || "Untitled Project",
    subtitle: data.subtitle || "",
    description: data.description || "",
    longDescription: data.longDescription || "",
    thumbnail: data.thumbnail || "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    category: data.category || "MERN Stack",
    technologies: data.technologies || [],
    features: data.features || [],
    githubUrl: data.githubUrl || "",
    liveUrl: data.liveUrl || "",
    isFeatured: data.isFeatured ?? false,
    isHighlighted: data.isHighlighted ?? false,
    isPublished: data.isPublished ?? true,
    order: data.order ?? memoryProjects.length + 1,
    createdAt: new Date().toISOString(),
  };
  memoryProjects.push(newProj);
  return newProj;
}

export async function updateProject(id: string, data: Partial<IProject>): Promise<IProject | null> {
  const db = await connectDB();
  if (db) {
    const doc = await Project.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  }
  const idx = memoryProjects.findIndex((p) => p._id === id);
  if (idx !== -1) {
    memoryProjects[idx] = { ...memoryProjects[idx], ...data };
    return memoryProjects[idx];
  }
  return null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await connectDB();
  if (db) {
    await Project.findByIdAndDelete(id);
    return true;
  }
  const initialLen = memoryProjects.length;
  memoryProjects = memoryProjects.filter((p) => p._id !== id);
  return memoryProjects.length < initialLen;
}

export async function getSkillsData(onlyEnabled = true): Promise<ISkill[]> {
  const db = await connectDB();
  if (db) {
    await ensureDatabaseSeeded();
    const query = onlyEnabled ? { isEnabled: true } : {};
    const docs = await Skill.find(query).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  }
  const skills = onlyEnabled ? memorySkills.filter((s) => s.isEnabled) : memorySkills;
  return skills.sort((a, b) => a.order - b.order);
}

export async function createSkill(data: Partial<ISkill>): Promise<ISkill> {
  const db = await connectDB();
  if (db) {
    const doc = await Skill.create(data);
    return JSON.parse(JSON.stringify(doc));
  }
  const newSkill: ISkill = {
    _id: `mem_skill_${Date.now()}`,
    name: data.name || "Skill",
    category: data.category || "Frontend",
    proficiency: data.proficiency ?? 80,
    order: data.order ?? memorySkills.length + 1,
    isEnabled: data.isEnabled ?? true,
  };
  memorySkills.push(newSkill);
  return newSkill;
}

export async function updateSkill(id: string, data: Partial<ISkill>): Promise<ISkill | null> {
  const db = await connectDB();
  if (db) {
    const doc = await Skill.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  }
  const idx = memorySkills.findIndex((s) => s._id === id);
  if (idx !== -1) {
    memorySkills[idx] = { ...memorySkills[idx], ...data };
    return memorySkills[idx];
  }
  return null;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const db = await connectDB();
  if (db) {
    await Skill.findByIdAndDelete(id);
    return true;
  }
  const initialLen = memorySkills.length;
  memorySkills = memorySkills.filter((s) => s._id !== id);
  return memorySkills.length < initialLen;
}

export async function getTimelineData(): Promise<ITimeline[]> {
  const db = await connectDB();
  if (db) {
    await ensureDatabaseSeeded();
    const docs = await Timeline.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  }
  return memoryTimeline.sort((a, b) => a.order - b.order);
}

export async function createTimeline(data: Partial<ITimeline>): Promise<ITimeline> {
  const db = await connectDB();
  if (db) {
    const doc = await Timeline.create(data);
    return JSON.parse(JSON.stringify(doc));
  }
  const newEntry: ITimeline = {
    _id: `mem_time_${Date.now()}`,
    type: data.type || "Education",
    title: data.title || "",
    organization: data.organization || "",
    period: data.period || "",
    duration: data.duration || "",
    grade: data.grade || "",
    description: data.description || "",
    highlights: data.highlights || [],
    order: data.order ?? memoryTimeline.length + 1,
  };
  memoryTimeline.push(newEntry);
  return newEntry;
}

export async function updateTimeline(id: string, data: Partial<ITimeline>): Promise<ITimeline | null> {
  const db = await connectDB();
  if (db) {
    const doc = await Timeline.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  }
  const idx = memoryTimeline.findIndex((t) => t._id === id);
  if (idx !== -1) {
    memoryTimeline[idx] = { ...memoryTimeline[idx], ...data };
    return memoryTimeline[idx];
  }
  return null;
}

export async function deleteTimeline(id: string): Promise<boolean> {
  const db = await connectDB();
  if (db) {
    await Timeline.findByIdAndDelete(id);
    return true;
  }
  const initialLen = memoryTimeline.length;
  memoryTimeline = memoryTimeline.filter((t) => t._id !== id);
  return memoryTimeline.length < initialLen;
}

export async function getMessagesData(): Promise<IContactMessage[]> {
  const db = await connectDB();
  if (db) {
    const docs = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  }
  return [...memoryMessages].reverse();
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<IContactMessage> {
  const db = await connectDB();
  if (db) {
    const doc = await ContactMessage.create(data);
    return JSON.parse(JSON.stringify(doc));
  }
  const newMsg: IContactMessage = {
    _id: `mem_msg_${Date.now()}`,
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  memoryMessages.push(newMsg);
  return newMsg;
}

export async function markMessageRead(id: string, isRead = true): Promise<boolean> {
  const db = await connectDB();
  if (db) {
    await ContactMessage.findByIdAndUpdate(id, { isRead });
    return true;
  }
  const msg = memoryMessages.find((m) => m._id === id);
  if (msg) {
    msg.isRead = isRead;
    return true;
  }
  return false;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const db = await connectDB();
  if (db) {
    await ContactMessage.findByIdAndDelete(id);
    return true;
  }
  const initialLen = memoryMessages.length;
  memoryMessages = memoryMessages.filter((m) => m._id !== id);
  return memoryMessages.length < initialLen;
}

export async function getSettingsData(): Promise<IWebsiteSettings> {
  const db = await connectDB();
  if (db) {
    await ensureDatabaseSeeded();
    const doc = await WebsiteSettings.findOne().lean();
    if (doc) return JSON.parse(JSON.stringify(doc));
  }
  return memorySettings;
}

export async function updateSettingsData(data: Partial<IWebsiteSettings>): Promise<IWebsiteSettings> {
  const db = await connectDB();
  if (db) {
    const doc = await WebsiteSettings.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true }).lean();
    return JSON.parse(JSON.stringify(doc));
  }
  memorySettings = { ...memorySettings, ...data };
  return memorySettings;
}

export async function getDashboardStats() {
  const projects = await getProjectsData(false);
  const skills = await getSkillsData(false);
  const messages = await getMessagesData();

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.isPublished).length;
  const draftProjects = totalProjects - publishedProjects;
  const totalSkills = skills.length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  return {
    totalProjects,
    publishedProjects,
    draftProjects,
    totalSkills,
    totalMessages,
    unreadMessages,
    recentMessages: messages.slice(0, 5),
  };
}
