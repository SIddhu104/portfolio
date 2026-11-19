"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Download, Mail, ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { IProfile, IProject } from "@/types";

// Dynamically import 3D Scene to optimize initial page hydration
const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[340px] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
    </div>
  ),
});

interface HeroSectionProps {
  profile: IProfile;
  featuredProjects: IProject[];
  onOpenProjectModal: (project: IProject) => void;
}

export default function HeroSection({
  profile,
  featuredProjects,
  onOpenProjectModal,
}: HeroSectionProps) {
  // Animated typing text effect
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = profile.titles && profile.titles.length > 0
    ? profile.titles
    : ["MERN Stack Developer", "Full-Stack Web Developer", "React.js Developer", "Next.js (Learning Phase)"];

  useEffect(() => {
    const currentRole = roles[currentRoleIndex % roles.length];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        if (displayText.length === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIndex, roles]);

  const primaryFeatured = featuredProjects[0];
  const secondaryLeft = featuredProjects[1];
  const secondaryRight = featuredProjects[2];

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Grid: Typography & 3D Interactive Scene */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Left Column: Big Headline & Bio */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top row: 'Full-stack' and 'Projects ->' pill button */}
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h1 className="hero-title text-5xl sm:text-7xl md:text-8xl lg:text-8xl tracking-tighter text-white">
                Full-stack
              </h1>

              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <span>Projects</span>
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>

            {/* Middle row: bio on left, giant 'Developer' on right */}
            <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-sm">
                <p>
                  {profile.heroBio || (
                    <>
                      My goal is to <span className="text-white font-medium italic">build modern, scalable</span> and{" "}
                      <span className="text-white font-medium italic">interactive web applications</span> with the MERN
                      stack and Next.js.
                    </>
                  )}
                </p>

                {/* Animated Typing Role Badge */}
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>{displayText}</span>
                  <span className="animate-pulse">|</span>
                </div>
              </div>

              <div className="md:col-span-7 text-right relative z-30">
                <span className="hero-title block relative z-30 text-5xl sm:text-7xl md:text-8xl lg:text-8xl tracking-tighter text-white/95">
                  Developer
                </span>
              </div>
            </div>

            {/* Social and Action Pills matching reference design */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href={profile.githubUrl || "https://github.com/siddheshkorade"}
                target="_blank"
                rel="noreferrer"
                className="glass-pill px-4 py-2 rounded-full text-xs sm:text-sm font-mono text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>

              <a
                href={profile.linkedinUrl || "https://linkedin.com/in/siddheshkorade"}
                target="_blank"
                rel="noreferrer"
                className="glass-pill px-4 py-2 rounded-full text-xs sm:text-sm font-mono text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>

              <a
                href={`mailto:${profile.email || "siddheshkorade10@gmail.com"}`}
                className="glass-pill px-4 py-2 rounded-full text-xs sm:text-sm font-mono text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </a>

              <a
                href={profile.resumeUrl || "/resume.pdf"}
                download="Siddhesh_Korade_Resume.pdf"
                className="glass-pill px-4 py-2 rounded-full text-xs sm:text-sm font-mono text-cyan-300 border-cyan-500/30 hover:border-cyan-400 flex items-center gap-1.5 bg-cyan-950/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume &darr;</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D WebGL Scene */}
          <div className="lg:col-span-5 h-[340px] sm:h-[400px] lg:h-[480px] w-full relative z-0">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 border border-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center">
              <HeroScene />
            </div>
          </div>
        </div>

        {featuredProjects.length > 0 && (
          <div className="mt-8 pt-8 border-t border-white/[0.08]">
            <div
              className={`grid grid-cols-1 gap-4 lg:gap-6 ${
                featuredProjects.length === 1
                  ? "md:grid-cols-1 max-w-xl mx-auto"
                  : featuredProjects.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-3"
              }`}
            >
              {secondaryLeft && (
                <div
                  onClick={() => onOpenProjectModal(secondaryLeft)}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between min-h-[170px]"
                >
                  <div>
                    <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase block">
                      [{secondaryLeft.title}]
                    </span>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{secondaryLeft.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-4">
                    <span>{secondaryLeft.subtitle || "Full-Stack Project"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {primaryFeatured && (
                <div
                  onClick={() => onOpenProjectModal(primaryFeatured)}
                  className="relative rounded-2xl overflow-hidden p-6 cursor-pointer border border-white/20 transition-all duration-300 hover:scale-[1.02] shadow-[0_12px_40px_-10px_rgba(139,92,246,0.3)] flex flex-col justify-between min-h-[200px]"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.45), rgba(59, 130, 246, 0.25) 50%, rgba(13, 14, 18, 0.9) 100%)",
                  }}
                >
                  <div className="relative z-10">
                    <span className="text-xs font-mono tracking-wider text-purple-300 uppercase block font-semibold">
                      [{primaryFeatured.title}] &mdash; {primaryFeatured.subtitle || "Highlighted Project"}
                    </span>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-200 line-clamp-3 leading-relaxed">
                      {primaryFeatured.description}
                    </p>
                  </div>
                  <div className="relative z-10 pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors"
                    >
                      <span>View project</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              {secondaryRight && (
                <div
                  onClick={() => onOpenProjectModal(secondaryRight)}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between min-h-[170px]"
                >
                  <div>
                    <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase block">
                      [{secondaryRight.title}]
                    </span>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{secondaryRight.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-4">
                    <span>{secondaryRight.subtitle || "Highlighted Project"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
