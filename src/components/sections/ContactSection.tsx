"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { ArrowRight, Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { IProfile } from "@/types";

interface ContactSectionProps {
  profile: IProfile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Fire celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#8b5cf6", "#10b981", "#ffffff"],
      });

      setStatus({
        type: "success",
        message: data.message || "Message sent successfully! I will get back to you shortly.",
      });

      // Clear form
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header matching reference design */}
        <div className="section-label mb-4">... /Contacts ...</div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <h2 className="hero-title text-5xl sm:text-7xl lg:text-8xl tracking-tighter text-white max-w-2xl">
            Let&apos;s work <br />
            together
          </h2>

          <div className="flex flex-col items-start lg:items-end gap-3 font-mono">
            <span className="text-sm sm:text-base text-zinc-400">
              [{profile.email || "siddheshkorade10@gmail.com"}]
            </span>
            <a
              href={`mailto:${profile.email || "siddheshkorade10@gmail.com"}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all shadow-xl"
            >
              <span>Contact me</span>
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs">
                <ArrowRight className="w-3 h-3" />
              </span>
            </a>
          </div>
        </div>

        {/* Contact Form & Information Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info Card */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight">Direct Information</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Have an idea, project, or full-time opportunity? Reach out directly or fill out the
              form. I typically reply within 24 hours.
            </p>

            <div className="space-y-4 font-mono text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{profile.email || "siddheshkorade10@gmail.com"}</span>
              </div>

              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-purple-400">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{profile.phone || "+91 8261825954"}</span>
              </div>

              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{profile.location || "Kolhapur, Maharashtra, India"}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                Available for:
              </span>
              <div className="flex flex-wrap gap-2">
                {["Full-time Roles", "Frontend & UI", "MERN Stack", "Remote Work"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Full-Stack Message Form */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project Inquiry / Job Opportunity"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me about your project, timeline, or open role..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors resize-none"
                />
              </div>

              {/* Status alerts */}
              {status.type === "success" && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{status.message}</span>
                </div>
              )}

              {status.type === "error" && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 disabled:opacity-50 transition-all shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
