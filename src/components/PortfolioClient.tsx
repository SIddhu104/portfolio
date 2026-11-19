"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import WorkSection from "@/components/sections/WorkSection";
import ServicesSection from "@/components/sections/ServicesSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import InteractiveCanvas from "@/components/3d/InteractiveCanvas";
import ProjectModal from "@/components/ui/ProjectModal";
import { IProfile, IProject, ISkill, ITimeline, IWebsiteSettings } from "@/types";

interface PortfolioClientProps {
  initialProfile: IProfile;
  initialProjects: IProject[];
  initialSkills: ISkill[];
  initialTimeline: ITimeline[];
  initialSettings: IWebsiteSettings;
}

export default function PortfolioClient({
  initialProfile,
  initialProjects,
  initialSkills,
  initialTimeline,
  initialSettings,
}: PortfolioClientProps) {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const highlightedProjects = initialProjects
    .filter((project) => project.isHighlighted)
    .slice(0, 3);
  const heroProjects = highlightedProjects.length > 0
    ? highlightedProjects
    : initialProjects.filter((project) => project.isFeatured).slice(0, 3);

  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 selection:bg-purple-600/30 selection:text-white">
      {/* Background Interactive Canvas Particle Network */}
      <InteractiveCanvas />

      {/* Desktop Custom Animated Cursor */}
      {initialSettings.enableCustomCursor && <CustomCursor />}

      {/* Top Fixed Floating Navigation Bar */}
      <Navbar
        name={initialProfile.name}
        isOpenToWork={initialProfile.isOpenToWork}
      />

      <main className="relative z-10 flex flex-col">
        {/* 1. Hero Section matching reference screenshot */}
        <HeroSection
          profile={initialProfile}
          featuredProjects={heroProjects}
          onOpenProjectModal={(p) => setSelectedProject(p)}
        />

        {/* 2. About Me & Tech Stack Bento Section */}
        <AboutSection
          profile={initialProfile}
          skills={initialSkills}
        />

        {/* 3. Skills Section with animated progress bars */}
        <SkillsSection skills={initialSkills} />

        {/* 4. Featured Projects Showcase Section */}
        <ProjectsSection
          projects={initialProjects}
          onOpenProjectModal={(p) => setSelectedProject(p)}
        />

        {/* 5. Work, Internships & Education Timeline */}
        <WorkSection timeline={initialTimeline} />

        {/* 6. Services & Core Capabilities */}
        <ServicesSection />

        {/* 7. Contact Section matching reference screenshot */}
        <ContactSection profile={initialProfile} />
      </main>

      {/* Footer */}
      <Footer
        name={initialProfile.name}
        email={initialProfile.email}
        githubUrl={initialProfile.githubUrl}
        linkedinUrl={initialProfile.linkedinUrl}
      />

      {/* Interactive Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
