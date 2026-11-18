"use client";

import React, { useState } from "react";
import { IProject } from "@/types";
import { ExternalLink, ArrowRight, Layers, Sparkles, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectsSectionProps {
  projects: IProject[];
  onOpenProjectModal: (project: IProject) => void;
}

export default function ProjectsSection({
  projects,
  onOpenProjectModal,
}: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    "All",
    "MERN Stack",
    "Next.js",
    "AI / Gen-AI",
    "Full Stack",
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-label mb-2">... /Portfolio ...</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Featured Work
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? "bg-white text-black font-semibold shadow-md"
                    : "glass-pill text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id || project.title}
              className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group transition-all duration-300"
            >
              {/* Card Header & Visual Thumbnail */}
              <div>
                <div
                  className="h-44 w-full relative overflow-hidden p-6 flex flex-col justify-between"
                  style={{
                    background:
                      project.thumbnail && project.thumbnail.startsWith("linear-gradient")
                        ? project.thumbnail
                        : "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)",
                  }}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-mono text-white/90 border border-white/10">
                      {project.category}
                    </span>
                    {project.isFeatured && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/30 backdrop-blur-md text-[11px] font-mono text-purple-200 border border-purple-400/30">
                        <Sparkles className="w-3 h-3 text-purple-300" />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="z-10">
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:translate-x-1 transition-transform">
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="text-xs text-white/80 font-mono mt-0.5">{project.subtitle}</p>
                    )}
                  </div>

                  {/* Aesthetic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-transparent opacity-80" />
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.02] text-[11px] font-mono text-zinc-500">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Highlights Bullet Preview */}
                  {project.features && project.features.length > 0 && (
                    <div className="space-y-1.5 border-t border-white/[0.06] pt-3 mb-4">
                      {project.features.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-white/[0.06] mt-auto flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpenProjectModal(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full glass-pill hover:text-white text-zinc-400"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full glass-pill hover:text-white text-cyan-300 border-cyan-500/30"
                      title="View Live Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
