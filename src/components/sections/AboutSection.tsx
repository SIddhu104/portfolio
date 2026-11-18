"use client";

import React from "react";
import { IProfile, ISkill } from "@/types";
import { Sparkles, MapPin, Briefcase, GraduationCap, Code2, Layers, Database, Cpu } from "lucide-react";

interface AboutSectionProps {
  profile: IProfile;
  skills: ISkill[];
}

export default function AboutSection({ profile, skills }: AboutSectionProps) {
  // Group skills by category
  const frontendSkills = skills
    .filter((s) => s.category === "Frontend" && s.isEnabled)
    .map((s) => s.name);
  const backendSkills = skills
    .filter((s) => s.category === "Backend" && s.isEnabled)
    .map((s) => s.name);
  const databaseSkills = skills
    .filter((s) => s.category === "Database" && s.isEnabled)
    .map((s) => s.name);
  const toolSkills = skills
    .filter((s) => s.category === "Tools & Security" && s.isEnabled)
    .map((s) => s.name);

  return (
    <section id="about" className="py-20 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Label on left, quote on right */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-12">
          <div className="section-label">... /About me ...</div>
          <div className="max-w-xl text-left md:text-right">
            <p className="text-zinc-300 text-sm sm:text-base font-normal leading-relaxed">
              {profile.aboutBio || (
                <>
                  Hi, I&apos;m Siddhesh Korade, a dedicated <span className="text-white font-medium italic">MERN Stack &amp; Full-Stack Developer</span>{" "}
                  (Fresher). I specialize in building responsive, functional web applications using React, Node.js, Express, and MongoDB, and I am currently expanding into Next.js.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Bento Grid Layout matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (8 cols): Tech Stack Cards */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between gap-6">
            {/* 1. Large Top Card: Front-end */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white tracking-wide">Front-end</h3>
              </div>
              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-loose">
                {frontendSkills.length > 0
                  ? frontendSkills.join("  /  ")
                  : "HTML5 / CSS3 / JavaScript / TypeScript / React.js / Redux Toolkit / Context API / Tailwind CSS / Vite / Next.js (Learning)"}
              </p>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
            </div>

            {/* 2. Three Column Subgrid: Back-end, Database, Languages and tools */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Back-end */}
              <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-3 text-purple-400">
                    <Code2 className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Back-end</h4>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                    {backendSkills.length > 0
                      ? backendSkills.join(" / ")
                      : "Node.js / Express.js / REST APIs / Authentication / API Integration"}
                  </p>
                </div>
              </div>

              {/* Database */}
              <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-3 text-blue-400">
                    <Database className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Database</h4>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                    {databaseSkills.length > 0
                      ? databaseSkills.join(" / ")
                      : "MongoDB / MySQL / Mongoose"}
                  </p>
                </div>
              </div>

              {/* Languages and tools */}
              <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-3 text-emerald-400">
                    <Cpu className="w-4 h-4" />
                    <h4 className="text-sm font-bold text-white">Tools &amp; Lang</h4>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                    {toolSkills.length > 0
                      ? toolSkills.join(" / ")
                      : "Python / Git / GitHub / VS Code / Postman"}
                  </p>
                </div>
              </div>
            </div>

            {/* Career Objective from resume */}
            <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 bg-cyan-950/10 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                <span className="text-cyan-300 font-semibold uppercase tracking-wider text-[11px] block sm:inline sm:mr-1">
                  Career Objective:
                </span>
                Seeking entry-level opportunities to gain practical excellence in the IT industry and put my full-stack MERN &amp; analytical skills to contribute to organizational growth.
              </p>
            </div>

            {/* Bottom Caption */}
            <p className="text-xs font-mono text-zinc-500 pl-2">
              Some of my favorite technologies and tools that I work with daily.
            </p>
          </div>

          {/* Right Column (4 cols): Developer Portrait / Holographic Card */}
          <div className="lg:col-span-5 xl:col-span-4 flex">
            <div className="w-full glass-panel rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden border border-white/10 group">
              {/* Photo / Avatar Placeholder with futuristic visualizer */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-800/60 to-zinc-950/80 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-xl shadow-purple-500/20 mb-4 animate-float">
                      <div className="w-full h-full rounded-full bg-[#0d0e12] flex items-center justify-center text-3xl font-bold font-mono text-white">
                        SK
                      </div>
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                      [SIDDHESH KORADE]
                    </span>
                    <span className="text-sm font-semibold text-white mt-1">MERN Stack Developer</span>
                    <span className="text-[11px] font-mono text-cyan-400 mt-0.5">Fresher &bull; Full-Stack Focus</span>
                  </div>
                )}

                {/* Cyber badge overlay */}
                <div className="absolute bottom-3 left-3 right-3 glass-pill px-3 py-2 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>Kolhapur, India</span>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Ready to Join
                  </span>
                </div>
              </div>

              {/* Quick Profile Summary stats */}
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-center font-mono">
                <div className="glass-pill p-2 rounded-xl">
                  <div className="text-sm sm:text-base font-bold text-white">{profile.yearsOfExperience || "Fresher"}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Level</div>
                </div>
                <div className="glass-pill p-2 rounded-xl">
                  <div className="text-sm sm:text-base font-bold text-white">{profile.projectsCompleted || "MERN Stack"}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Focus</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
