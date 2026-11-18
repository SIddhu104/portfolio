"use client";

import React, { useEffect } from "react";
import { IProject } from "@/types";
import { X, ExternalLink, CheckCircle, Sparkles, Layers } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectModalProps {
  project: IProject | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click area */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl bg-[#0c0d12]/95 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass-pill hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div
          className="h-44 sm:h-52 w-full rounded-2xl relative overflow-hidden p-6 sm:p-8 flex flex-col justify-end mb-6"
          style={{
            background:
              project.thumbnail && project.thumbnail.startsWith("linear-gradient")
                ? project.thumbnail
                : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
          }}
        >
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono text-white/90 border border-white/10">
              {project.category}
            </span>
            {project.isFeatured && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/40 backdrop-blur-md text-xs font-mono text-purple-200 border border-purple-400/40">
                <Sparkles className="w-3 h-3" />
                Featured Project
              </span>
            )}
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h2>
            {project.subtitle && (
              <p className="text-sm text-white/90 font-mono mt-1">{project.subtitle}</p>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent opacity-90" />
        </div>

        {/* Modal Body */}
        <div className="space-y-6">
          {/* Detailed Overview */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Overview
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
                Key Features &amp; Capabilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs sm:text-sm text-zinc-300"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Stack */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="glass-pill px-5 py-2.5 rounded-full text-xs font-mono text-zinc-200 hover:text-white flex items-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center gap-2 shadow-lg"
              >
                <span>Open Live Project</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
