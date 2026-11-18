"use client";

import React, { useState } from "react";
import { ITimeline } from "@/types";
import { ArrowUpRight, Award, Briefcase, GraduationCap } from "lucide-react";

interface WorkSectionProps {
  timeline: ITimeline[];
}

export default function WorkSection({ timeline }: WorkSectionProps) {
  const [activeItem, setActiveItem] = useState<ITimeline | null>(null);

  return (
    <section id="work" className="py-24 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="section-label mb-2">... /Experience &amp; Certifications ...</div>
            <h2 className="hero-title text-5xl sm:text-7xl font-extrabold text-white tracking-tight">
              Work
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-500 max-w-sm text-left md:text-right">
            Professional internship and industry certifications demonstrating practical full-stack and analytical skills.
          </p>
        </div>

        {/* Directory-Style Interactive Table Rows (Matching Reference Screenshot) */}
        <div className="space-y-3">
          {timeline.map((item) => (
            <div
              key={item._id || item.title}
              onClick={() => setActiveItem(activeItem?._id === item._id ? null : item)}
              className="group relative rounded-2xl border border-white/10 p-5 sm:p-6 transition-all duration-200 cursor-pointer bg-[#0c0d12]/60 hover:bg-white hover:text-black hover:border-white shadow-sm hover:shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* 1. Year & Duration */}
                <div className="md:col-span-3 font-mono">
                  <div className="text-sm font-bold tracking-tight text-white group-hover:text-black">
                    [{item.period}]
                  </div>
                  <div className="text-xs text-zinc-500 group-hover:text-zinc-700 uppercase tracking-widest mt-0.5">
                    {item.duration || item.type}
                  </div>
                </div>

                {/* 2. Company / Institute */}
                <div className="md:col-span-5 font-mono">
                  <div className="text-sm sm:text-base font-semibold text-zinc-200 group-hover:text-black tracking-tight">
                    [{item.organization}]
                  </div>
                  {item.grade && (
                    <div className="text-xs text-cyan-400 group-hover:text-blue-800 font-medium">
                      Score: {item.grade}
                    </div>
                  )}
                </div>

                {/* 3. Category & Role / Degree */}
                <div className="md:col-span-4 flex items-center justify-between font-mono">
                  <div className="text-xs sm:text-sm font-medium text-zinc-300 group-hover:text-black">
                    <span className="text-zinc-500 group-hover:text-zinc-600">{item.type}</span> |{" "}
                    <span className="font-semibold">{item.title}</span>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 ml-2" />
                </div>
              </div>

              {/* Collapsible detail tray */}
              {item.description && (
                <div className="mt-4 pt-4 border-t border-white/10 group-hover:border-black/15 text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-800 leading-relaxed font-sans">
                  <p>{item.description}</p>
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-white/[0.06] group-hover:bg-black/[0.08] text-[11px] font-mono text-zinc-300 group-hover:text-black border border-white/10 group-hover:border-black/10"
                        >
                          &bull; {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
