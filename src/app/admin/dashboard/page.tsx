"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  FileText,
  Upload,
} from "lucide-react";
import { IProfile, IProject, ISkill, ITimeline, IContactMessage, IWebsiteSettings } from "@/types";

type AdminTab = "overview" | "profile" | "projects" | "skills" | "timeline" | "messages" | "settings";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ fullName?: string; email?: string } | null>(null);

  // Data states
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [timeline, setTimeline] = useState<ITimeline[]>([]);
  const [messages, setMessages] = useState<IContactMessage[]>([]);
  const [settings, setSettings] = useState<IWebsiteSettings | null>(null);

  // Status notification state
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form modal states
  const [editingProject, setEditingProject] = useState<Partial<IProject> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [editingSkill, setEditingSkill] = useState<Partial<ISkill> | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const [editingTimeline, setEditingTimeline] = useState<Partial<ITimeline> | null>(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  const [activeMessage, setActiveMessage] = useState<IContactMessage | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadNotice, setResumeUploadNotice] = useState<string | null>(null);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleUploadResumeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      showNotification("Please select a valid PDF file (.pdf)", "error");
      return;
    }

    setUploadingResume(true);
    setResumeUploadNotice(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload resume");
      }

      if (profile) {
        setProfile({ ...profile, resumeUrl: data.url });
      }
      showNotification("New resume uploaded and published successfully!");
      setResumeUploadNotice(`Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  };

  // Check authentication & load initial admin data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/admin/login");
        return;
      }
      const authData = await authRes.json();
      setAdminUser(authData.admin);

      // Fetch all collections in parallel
      const [pRes, projRes, sRes, tRes, mRes, setRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/projects?all=true"),
        fetch("/api/skills?all=true"),
        fetch("/api/timeline"),
        fetch("/api/contact"),
        fetch("/api/settings"),
      ]);

      if (pRes.ok) {
        const d = await pRes.json();
        setProfile(d.profile);
      }
      if (projRes.ok) {
        const d = await projRes.json();
        setProjects(d.projects || []);
      }
      if (sRes.ok) {
        const d = await sRes.json();
        setSkills(d.skills || []);
      }
      if (tRes.ok) {
        const d = await tRes.json();
        setTimeline(d.timeline || []);
      }
      if (mRes.ok) {
        const d = await mRes.json();
        setMessages(d.messages || []);
      }
      if (setRes.ok) {
        const d = await setRes.json();
        setSettings(d.settings);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // --------------------------------------------------------------------------
  // Profile Handlers
  // --------------------------------------------------------------------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        showNotification("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "Error updating profile", "error");
    }
  };

  // --------------------------------------------------------------------------
  // Project Handlers
  // --------------------------------------------------------------------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const isNew = !editingProject._id;
      const url = "/api/projects";
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      if (!res.ok) throw new Error("Failed to save project");

      showNotification(isNew ? "Project created!" : "Project updated!");
      setIsProjectModalOpen(false);
      setEditingProject(null);
      loadDashboardData();
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "Error saving project", "error");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Project deleted");
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch {
      showNotification("Failed to delete project", "error");
    }
  };

  const handleTogglePublishProject = async (project: IProject) => {
    try {
      const updated = { ...project, isPublished: !project.isPublished };
      const res = await fetch(`/api/projects`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project._id, isPublished: updated.isPublished }),
      });
      if (res.ok) {
        setProjects(projects.map((p) => (p._id === project._id ? updated : p)));
        showNotification(updated.isPublished ? "Project published!" : "Project saved to drafts");
      }
    } catch {
      showNotification("Failed to toggle status", "error");
    }
  };

  // --------------------------------------------------------------------------
  // Skill Handlers
  // --------------------------------------------------------------------------
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      const isNew = !editingSkill._id;
      const url = "/api/skills";
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSkill),
      });

      if (!res.ok) throw new Error("Failed to save skill");

      showNotification(isNew ? "Skill added!" : "Skill updated!");
      setIsSkillModalOpen(false);
      setEditingSkill(null);
      loadDashboardData();
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "Error saving skill", "error");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSkills(skills.filter((s) => s._id !== id));
        showNotification("Skill deleted");
      }
    } catch {
      showNotification("Failed to delete skill", "error");
    }
  };

  // --------------------------------------------------------------------------
  // Timeline Handlers
  // --------------------------------------------------------------------------
  const handleSaveTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimeline) return;

    try {
      const isNew = !editingTimeline._id;
      const url = "/api/timeline";
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTimeline),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      showNotification(isNew ? "Timeline entry added!" : "Timeline entry updated!");
      setIsTimelineModalOpen(false);
      setEditingTimeline(null);
      loadDashboardData();
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "Error saving entry", "error");
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm("Delete this timeline entry?")) return;
    try {
      const res = await fetch(`/api/timeline?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTimeline(timeline.filter((t) => t._id !== id));
        showNotification("Timeline entry deleted");
      }
    } catch {
      showNotification("Failed to delete entry", "error");
    }
  };

  // --------------------------------------------------------------------------
  // Message Handlers
  // --------------------------------------------------------------------------
  const handleToggleReadMessage = async (msg: IContactMessage) => {
    try {
      const newReadStatus = !msg.isRead;
      const res = await fetch(`/api/contact`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg._id, isRead: newReadStatus }),
      });
      if (res.ok) {
        setMessages(messages.map((m) => (m._id === msg._id ? { ...m, isRead: newReadStatus } : m)));
      }
    } catch {
      showNotification("Failed to update status", "error");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((m) => m._id !== id));
        showNotification("Message removed");
        if (activeMessage?._id === id) setActiveMessage(null);
      }
    } catch {
      showNotification("Failed to delete message", "error");
    }
  };

  // --------------------------------------------------------------------------
  // Settings Handlers
  // --------------------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showNotification("Website settings saved!");
      }
    } catch {
      showNotification("Failed to save settings", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Loading Admin Dashboard...
          </span>
        </div>
      </div>
    );
  }

  const publishedCount = projects.filter((p) => p.isPublished).length;
  const draftCount = projects.length - publishedCount;
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col md:flex-row selection:bg-purple-600/30">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0a0f] border-r border-white/10 flex flex-col justify-between shrink-0 p-4">
        <div>
          {/* Admin Header */}
          <div className="p-3 mb-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                Management System
              </div>
              <h2 className="text-sm font-bold text-white tracking-tight">Siddhesh Korade</h2>
            </div>
            <Link
              href="/"
              target="_blank"
              className="p-1.5 rounded-lg glass-pill text-zinc-400 hover:text-white"
              title="View Live Portfolio"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "profile", label: "Profile & Resume", icon: User },
              { id: "projects", label: "Projects", icon: FolderGit2, badge: projects.length },
              { id: "skills", label: "Skills", icon: Cpu, badge: skills.length },
              { id: "timeline", label: "Work & Education", icon: GraduationCap },
              { id: "messages", label: "Messages", icon: Mail, badge: unreadCount > 0 ? unreadCount : undefined },
              { id: "settings", label: "Website Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-md"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        isActive
                          ? "bg-black text-white"
                          : tab.id === "messages" && unreadCount > 0
                          ? "bg-rose-500 text-white font-bold"
                          : "bg-white/10 text-zinc-300"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/10 mt-6">
          <div className="flex items-center justify-between px-2 text-xs font-mono text-zinc-400 mb-3">
            <span className="truncate">{adminUser?.email || "admin"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl glass-pill hover:bg-rose-500/20 text-rose-400 text-xs font-mono transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-screen">
        {/* Floating Notification */}
        {notice && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-mono animate-in slide-in-from-bottom-3 duration-200 ${
              notice.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/90 border-rose-500/30 text-rose-300"
            }`}
          >
            {notice.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {/* =========================================================================
            TAB 1: OVERVIEW
        ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 max-w-6xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Real-time metrics, website controls, and recent recruiter messages
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Total Projects
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">{projects.length}</div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1">
                  {publishedCount} Published / {draftCount} Drafts
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Skills Listed
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">{skills.length}</div>
                <div className="text-[11px] font-mono text-cyan-400 mt-1">Across 4 Tech Domains</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Total Inquiries
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">{messages.length}</div>
                <div className="text-[11px] font-mono text-purple-400 mt-1">
                  {unreadCount} Unread Messages
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Timeline Entries
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">{timeline.length}</div>
                <div className="text-[11px] font-mono text-amber-400 mt-1">
                  Internships &amp; Degrees
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingProject({
                      title: "",
                      subtitle: "",
                      description: "",
                      longDescription: "",
                      category: "MERN Stack",
                      thumbnail: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      technologies: [],
                      features: [],
                      isPublished: true,
                      order: projects.length + 1,
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs font-mono flex items-center gap-2 hover:bg-zinc-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Project</span>
                </button>

                <button
                  onClick={() => {
                    setEditingSkill({
                      name: "",
                      category: "Frontend",
                      proficiency: 85,
                      order: skills.length + 1,
                      isEnabled: true,
                    });
                    setIsSkillModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl glass-pill hover:text-white text-zinc-300 font-mono text-xs flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>

                <button
                  onClick={() => setActiveTab("profile")}
                  className="px-4 py-2 rounded-xl glass-pill hover:text-white text-zinc-300 font-mono text-xs flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Update Resume &amp; Bio</span>
                </button>
              </div>
            </div>

            {/* Recent Contact Messages */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Recent Inquiries
                </h2>
                <button
                  onClick={() => setActiveTab("messages")}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  View all ({messages.length}) &rarr;
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="text-xs font-mono text-zinc-500 py-6 text-center">
                  No messages received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 3).map((msg) => (
                    <div
                      key={msg._id}
                      onClick={() => {
                        setActiveMessage(msg);
                        setActiveTab("messages");
                      }}
                      className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{msg.name}</span>
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          )}
                        </div>
                        <div className="text-xs font-mono text-zinc-400 line-clamp-1 mt-0.5">
                          {msg.subject} &mdash; {msg.message}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PROFILE MANAGEMENT
        ========================================================================= */}
        {activeTab === "profile" && profile && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Profile &amp; Resume Management
              </h1>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Update your professional bio, contact handles, and active resume for interviewers
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Developer Titles (Comma Separated)
                </label>
                <input
                  type="text"
                  value={profile.titles.join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      titles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Hero Short Bio
                </label>
                <textarea
                  rows={2}
                  value={profile.heroBio}
                  onChange={(e) => setProfile({ ...profile, heroBio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Detailed About Me Description
                </label>
                <textarea
                  rows={4}
                  value={profile.aboutBio}
                  onChange={(e) => setProfile({ ...profile, aboutBio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profile.githubUrl}
                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profile.linkedinUrl}
                    onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Badges for Fresher / Level and Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Experience / Level Badge
                  </label>
                  <input
                    type="text"
                    placeholder="Fresher"
                    value={profile.yearsOfExperience || ""}
                    onChange={(e) => setProfile({ ...profile, yearsOfExperience: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Focus / Domain Badge
                  </label>
                  <input
                    type="text"
                    placeholder="MERN Stack"
                    value={profile.projectsCompleted || ""}
                    onChange={(e) => setProfile({ ...profile, projectsCompleted: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Resume Upload & Link Manager */}
              <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase">
                    <FileText className="w-4 h-4" />
                    <span>Resume for Interviewers &amp; Recruiters</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Active: <span className="text-white font-semibold">{profile.resumeUrl ? "Configured" : "None"}</span>
                  </span>
                </div>

                {/* Direct File Upload Action */}
                <div className="p-4 rounded-xl bg-black/40 border border-dashed border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-white">Upload New Resume PDF</div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Select a new PDF from your computer to replace the current downloadable resume instantly.
                    </p>
                    {resumeUploadNotice && (
                      <div className="text-[11px] font-mono text-emerald-400 mt-1.5 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{resumeUploadNotice}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <label className={`cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all w-full sm:w-auto ${
                      uploadingResume
                        ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                        : "bg-cyan-500 text-black hover:bg-cyan-400 shadow-md"
                    }`}>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingResume ? "Uploading..." : "Upload New PDF"}</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        disabled={uploadingResume}
                        onChange={handleUploadResumeFile}
                        className="hidden"
                      />
                    </label>

                    {profile.resumeUrl && (
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl glass-pill text-cyan-300 hover:text-white hover:bg-white/10"
                        title="Preview current resume in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Manual Path / Cloud URL Fallback */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
                  <div className="sm:col-span-8">
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Or edit resume path / cloud URL manually:
                    </label>
                    <input
                      type="text"
                      value={profile.resumeUrl}
                      onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                      placeholder="/resume.pdf or https://..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="sm:col-span-4 flex items-end">
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl glass-pill text-xs font-mono text-center text-zinc-300 hover:text-white flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview File</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.isOpenToWork}
                    onChange={(e) => setProfile({ ...profile, isOpenToWork: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Show &quot;Available for Hire&quot; Status Badge</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 3: PROJECTS MANAGEMENT
        ========================================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Project Management
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Create, edit, publish, or draft showcase projects with tech tags &amp; live links
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProject({
                    title: "",
                    subtitle: "",
                    description: "",
                    longDescription: "",
                    category: "MERN Stack",
                    thumbnail: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    technologies: ["React.js", "Node.js", "MongoDB"],
                    features: ["Interactive user interface", "RESTful API backend"],
                    isPublished: true,
                    isFeatured: false,
                    order: projects.length + 1,
                  });
                  setIsProjectModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono flex items-center gap-2 hover:bg-zinc-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>

            {/* Projects Table / Card List */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
              <div className="divide-y divide-white/5">
                {projects.map((proj) => (
                  <div
                    key={proj._id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl shrink-0 border border-white/10"
                        style={{ background: proj.thumbnail }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{proj.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                              proj.isPublished
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                            }`}
                          >
                            {proj.isPublished ? "Published" : "Draft"}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500">
                            [{proj.category}]
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-1 max-w-xl">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.technologies.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded bg-white/[0.03] text-[10px] font-mono text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleTogglePublishProject(proj)}
                        className="p-2 rounded-xl glass-pill hover:text-white text-zinc-400"
                        title={proj.isPublished ? "Unpublish to draft" : "Publish to live website"}
                      >
                        {proj.isPublished ? (
                          <Eye className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-zinc-500" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setIsProjectModalOpen(true);
                        }}
                        className="p-2 rounded-xl glass-pill hover:text-white text-zinc-400"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj._id!)}
                        className="p-2 rounded-xl glass-pill hover:bg-rose-500/20 text-rose-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SKILLS MANAGEMENT
        ========================================================================= */}
        {activeTab === "skills" && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Skills Management
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Control skill categories, displayed technologies, and proficiency levels
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingSkill({
                    name: "",
                    category: "Frontend",
                    proficiency: 85,
                    order: skills.length + 1,
                    isEnabled: true,
                  });
                  setIsSkillModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono flex items-center gap-2 hover:bg-zinc-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Categorized list */}
            {(["Frontend", "Backend", "Database", "Tools & Security"] as const).map((cat) => {
              const catSkills = skills.filter((s) => s.category === cat);
              return (
                <div key={cat} className="glass-panel p-6 rounded-3xl border border-white/10">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center justify-between">
                    <span>{cat}</span>
                    <span className="text-xs text-zinc-500 font-normal">{catSkills.length} items</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {catSkills.map((sk) => (
                      <div
                        key={sk._id}
                        className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">{sk.name}</div>
                          <div className="text-xs font-mono text-cyan-400 mt-0.5">
                            Proficiency: {sk.proficiency}%
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingSkill(sk);
                              setIsSkillModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg glass-pill text-zinc-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(sk._id!)}
                            className="p-1.5 rounded-lg glass-pill text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            TAB 5: TIMELINE (WORK & EDUCATION)
        ========================================================================= */}
        {activeTab === "timeline" && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Work, Internship &amp; Education
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Manage timeline entries shown on the interactive Work directory
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTimeline({
                    type: "Internship",
                    title: "",
                    organization: "",
                    period: "",
                    duration: "",
                    description: "",
                    highlights: [],
                    order: timeline.length + 1,
                  });
                  setIsTimelineModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono flex items-center gap-2 hover:bg-zinc-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Timeline Entry</span>
              </button>
            </div>

            <div className="space-y-3">
              {timeline.map((entry) => (
                <div
                  key={entry._id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white/[0.05] text-cyan-300">
                        {entry.type}
                      </span>
                      <h3 className="text-base font-bold text-white">{entry.title}</h3>
                      <span className="text-xs font-mono text-zinc-400">
                        @ {entry.organization}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-zinc-500 mt-1">
                      Period: {entry.period} {entry.grade ? `| Grade: ${entry.grade}` : ""}
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 font-sans line-clamp-2">
                      {entry.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingTimeline(entry);
                        setIsTimelineModalOpen(true);
                      }}
                      className="p-2 rounded-xl glass-pill hover:text-white text-zinc-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTimeline(entry._id!)}
                      className="p-2 rounded-xl glass-pill hover:bg-rose-500/20 text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: CONTACT INBOX
        ========================================================================= */}
        {activeTab === "messages" && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Inquiries &amp; Messages
              </h1>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Messages submitted via the public contact form and stored securely
              </p>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
              {messages.length === 0 ? (
                <div className="p-12 text-center text-xs font-mono text-zinc-500">
                  Inbox is currently empty.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                        !msg.isRead ? "bg-purple-950/20" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5">
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                          )}
                          <span className="text-sm font-bold text-white">{msg.name}</span>
                          <span className="text-xs font-mono text-zinc-400">({msg.email})</span>
                        </div>
                        <div className="text-xs font-semibold text-zinc-300 font-mono mt-1">
                          {msg.subject}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                        <div className="text-[10px] font-mono text-zinc-500 mt-2">
                          Received: {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Recent"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-mono font-semibold hover:bg-zinc-200"
                        >
                          Reply Email
                        </a>

                        <button
                          onClick={() => handleToggleReadMessage(msg)}
                          className="p-2 rounded-xl glass-pill text-zinc-400 hover:text-white"
                          title={msg.isRead ? "Mark as unread" : "Mark as read"}
                        >
                          {msg.isRead ? (
                            <EyeOff className="w-4 h-4 text-zinc-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-cyan-400" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteMessage(msg._id!)}
                          className="p-2 rounded-xl glass-pill text-rose-400 hover:bg-rose-500/20"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: WEBSITE SETTINGS
        ========================================================================= */}
        {activeTab === "settings" && settings && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Website &amp; SEO Settings
              </h1>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Configure global metadata, contact routing, and visual settings
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-white/10">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Portfolio Title (Browser Tab)
                </label>
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Meta SEO Description
                </label>
                <textarea
                  rows={2}
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Inquiry Notification Receiver Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Downloaded Resume File Name
                </label>
                <input
                  type="text"
                  value={settings.resumeFileName}
                  onChange={(e) => setSettings({ ...settings, resumeFileName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-mono"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enable3DEffects}
                    onChange={(e) => setSettings({ ...settings, enable3DEffects: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Enable Three.js 3D Interactive Hero Scene</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableCustomCursor}
                    onChange={(e) => setSettings({ ...settings, enableCustomCursor: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Enable Custom Glowing Trailing Cursor (Desktop)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-zinc-200"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: PROJECT EDIT / CREATE
      ========================================================================= */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 bg-[#0c0d12]/95 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingProject._id ? "Edit Project" : "Create New Project"}
            </h2>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={editingProject.category || "MERN Stack"}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as IProject["category"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value="MERN Stack">MERN Stack</option>
                    <option value="Next.js">Next.js</option>
                    <option value="React.js">React.js</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI / Gen-AI">AI / Gen-AI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingProject.subtitle || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  placeholder="e.g. Gen-AI Platform"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Long Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.longDescription || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, longDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={(editingProject.technologies || []).join(", ")}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="React.js, Node.js, Express, MongoDB"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Features (Comma Separated)
                </label>
                <input
                  type="text"
                  value={(editingProject.features || []).join(", ")}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="AI question generation, Responsive UI, JWT auth"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, liveUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isPublished ?? true}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, isPublished: e.target.checked })
                    }
                    className="rounded bg-zinc-800 text-emerald-500"
                  />
                  <span>Published (Visible to Visitors)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isFeatured ?? false}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, isFeatured: e.target.checked })
                    }
                    className="rounded bg-zinc-800 text-purple-500"
                  />
                  <span>Featured Badge</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-pill text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-zinc-200"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SKILL EDIT / CREATE
      ========================================================================= */}
      {isSkillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/20 bg-[#0c0d12]/95 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingSkill._id ? "Edit Skill" : "Add New Skill"}
            </h2>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. Next.js"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Category *
                </label>
                <select
                  value={editingSkill.category || "Frontend"}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      category: e.target.value as ISkill["category"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Tools & Security">Tools &amp; Security</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Proficiency Level</span>
                  <span>{editingSkill.proficiency || 80}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={editingSkill.proficiency || 80}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-pill text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-zinc-200"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TIMELINE EDIT / CREATE
      ========================================================================= */}
      {isTimelineModalOpen && editingTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 bg-[#0c0d12]/95 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingTimeline._id ? "Edit Timeline Entry" : "Add Timeline Entry"}
            </h2>

            <form onSubmit={handleSaveTimeline} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Type *
                  </label>
                  <select
                    value={editingTimeline.type || "Internship"}
                    onChange={(e) =>
                      setEditingTimeline({
                        ...editingTimeline,
                        type: e.target.value as ITimeline["type"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Education">Education</option>
                    <option value="Certification">Certification</option>
                    <option value="Work">Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTimeline.period || ""}
                    onChange={(e) =>
                      setEditingTimeline({ ...editingTimeline, period: e.target.value })
                    }
                    placeholder="2024 – 2026"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Title / Role / Degree *
                </label>
                <input
                  type="text"
                  required
                  value={editingTimeline.title || ""}
                  onChange={(e) =>
                    setEditingTimeline({ ...editingTimeline, title: e.target.value })
                  }
                  placeholder="Master of Computer Applications (M.C.A.)"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Company / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={editingTimeline.organization || ""}
                  onChange={(e) =>
                    setEditingTimeline({ ...editingTimeline, organization: e.target.value })
                  }
                  placeholder="Vivekanand College, Kolhapur"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Duration / Level
                  </label>
                  <input
                    type="text"
                    value={editingTimeline.duration || ""}
                    onChange={(e) =>
                      setEditingTimeline({ ...editingTimeline, duration: e.target.value })
                    }
                    placeholder="Postgraduate / 6 Months"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Grade / Percentage
                  </label>
                  <input
                    type="text"
                    value={editingTimeline.grade || ""}
                    onChange={(e) =>
                      setEditingTimeline({ ...editingTimeline, grade: e.target.value })
                    }
                    placeholder="66.30% / CGPA 7.5"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingTimeline.description || ""}
                  onChange={(e) =>
                    setEditingTimeline({ ...editingTimeline, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsTimelineModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-pill text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-zinc-200"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
