"use client";

import React, { useState, useRef, useEffect } from "react";
import { ISkill } from "@/types";
import { Layers, Code2, Database, Cpu } from "lucide-react";

interface SkillsSectionProps {
  skills: ISkill[];
}

const categoryConfig = {
  Frontend: {
    icon: Layers,
    color: "text-cyan-400",
    bar: "bg-gradient-to-r from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/30",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/10",
  },
  Backend: {
    icon: Code2,
    color: "text-purple-400",
    bar: "bg-gradient-to-r from-purple-500 to-pink-500",
    glow: "shadow-purple-500/30",
    border: "border-purple-500/20",
    bg: "bg-purple-500/10",
  },
  Database: {
    icon: Database,
    color: "text-blue-400",
    bar: "bg-gradient-to-r from-blue-500 to-indigo-500",
    glow: "shadow-blue-500/30",
    border: "border-blue-500/20",
    bg: "bg-blue-500/10",
  },
  "Tools & Security": {
    icon: Cpu,
    color: "text-emerald-400",
    bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/30",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
  },
};

function SkillBar({
  skill,
  config,
  animate,
}: {
  skill: ISkill;
  config: (typeof categoryConfig)[keyof typeof categoryConfig];
  animate: boolean;
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs sm:text-sm font-mono text-zinc-200 group-hover:text-white transition-colors">
          {skill.name}
        </span>
        <span className={`text-xs font-mono font-bold ${config.color}`}>
          {skill.proficiency}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${config.bar} shadow-sm ${config.glow}`}
          style={{
            width: animate ? `${skill.proficiency}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "Frontend", "Backend", "Database", "Tools & Security"];

  const enabledSkills = skills.filter((s) => s.isEnabled);

  const displaySkills =
    activeCategory === "All"
      ? enabledSkills
      : enabledSkills.filter((s) => s.category === activeCategory);

  // Group into categories for All view
  const grouped: Record<string, ISkill[]> = {};
  if (activeCategory === "All") {
    for (const cat of ["Frontend", "Backend", "Database", "Tools & Security"]) {
      const catSkills = enabledSkills.filter((s) => s.category === cat);
      if (catSkills.length > 0) grouped[cat] = catSkills.sort((a, b) => a.order - b.order);
    }
  }

  // Intersection Observer for animate-on-scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimate(true), 150);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Reset animation on category change
  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(t);
  }, [activeCategory]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 border-t border-white/[0.08] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-label mb-2">... /Skills ...</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Technical Arsenal
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

        {/* All view: grouped by category */}
        {activeCategory === "All" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(grouped).map(([cat, catSkills]) => {
              const cfg = categoryConfig[cat as keyof typeof categoryConfig];
              const Icon = cfg.icon;
              return (
                <div
                  key={cat}
                  className={`glass-panel rounded-3xl p-6 sm:p-8 border ${cfg.border} group hover:border-opacity-50 transition-all`}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center ${cfg.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className={`text-base font-bold ${cfg.color} tracking-wide`}>{cat}</h3>
                    <span className="ml-auto text-xs font-mono text-zinc-500">
                      {catSkills.length} skills
                    </span>
                  </div>

                  <div className="space-y-4">
                    {catSkills.map((skill) => (
                      <SkillBar
                        key={skill._id || skill.name}
                        skill={skill}
                        config={cfg}
                        animate={animate}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Single category view: skill cards grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displaySkills.sort((a, b) => a.order - b.order).map((skill) => {
              const cfg =
                categoryConfig[skill.category as keyof typeof categoryConfig] ||
                categoryConfig.Frontend;
              return (
                <div
                  key={skill._id || skill.name}
                  className={`glass-panel glass-panel-hover rounded-2xl p-5 border ${cfg.border}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-white font-mono">{skill.name}</span>
                    <span className={`text-xs font-mono font-bold ${cfg.color}`}>
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${cfg.bar}`}
                      style={{ width: animate ? `${skill.proficiency}%` : "0%" }}
                    />
                  </div>
                  <div className="mt-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                      {skill.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom tech stack icon row */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <p className="text-xs font-mono text-zinc-500 text-center mb-5 uppercase tracking-widest">
            Core Technologies I Work With Daily
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "TypeScript", "Tailwind CSS", "Python", "Git", "Next.js (Learning)"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full glass-pill text-xs font-mono text-zinc-300 hover:text-white hover:border-white/25 transition-all"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
