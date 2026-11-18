"use client";

import React from "react";
import { Code, Globe, Cpu, Database, Sparkles, ShieldCheck } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Globe,
      title: "Full-Stack Web Development",
      description:
        "Building end-to-end, production-ready web apps with clean architecture, high scalability, and robust state management.",
      color: "text-blue-400",
    },
    {
      icon: Code,
      title: "MERN Stack Development",
      description:
        "Specialized in MongoDB, Express.js, React, and Node.js solutions designed for low latency, secure authentication, and real-time updates.",
      color: "text-purple-400",
    },
    {
      icon: Sparkles,
      title: "React & Modern Web Apps",
      description:
        "Building fast, responsive user interfaces with React.js, Tailwind CSS, reusable component libraries, and expanding into Next.js.",
      color: "text-cyan-400",
    },
    {
      icon: Cpu,
      title: "REST APIs & Microservices",
      description:
        "Architecting secure, well-documented RESTful APIs with input validation, rate limiting, and third-party integrations (e.g. Gemini AI, Payment gateways).",
      color: "text-emerald-400",
    },
    {
      icon: Database,
      title: "Database Architecture",
      description:
        "Efficient schema design, indexing, and transactional workflows using MongoDB Atlas, Mongoose ODM, and MySQL.",
      color: "text-amber-400",
    },
    {
      icon: ShieldCheck,
      title: "Security & Optimization",
      description:
        "Implementing JWT authentication, HTTP-only cookie security, password hashing, CORS configuration, and bundle size reduction.",
      color: "text-rose-400",
    },
  ];

  return (
    <section id="services" className="py-24 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="section-label mb-2">... /Capabilities ...</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Services &amp; Expertise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl glass-pill flex items-center justify-center mb-6 ${srv.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                    {srv.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
