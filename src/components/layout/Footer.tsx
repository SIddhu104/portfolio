"use client";

import React from "react";
import Link from "next/link";
import { Mail, ArrowUp, Lock } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

interface FooterProps {
  name?: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function Footer({
  name = "Siddhesh Korade",
  email = "siddheshkorade10@gmail.com",
  githubUrl = "https://github.com/siddheshkorade",
  linkedinUrl = "https://linkedin.com/in/siddheshkorade",
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#050507] py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-sm font-semibold tracking-tight text-white">{name}</span>
            <span className="text-xs font-mono text-zinc-500">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full glass-pill text-zinc-400 hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full glass-pill text-zinc-400 hover:text-white transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${email}`}
              className="p-2 rounded-full glass-pill text-zinc-400 hover:text-white transition-colors"
              aria-label="Send Email"
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full glass-pill text-zinc-400 hover:text-white transition-colors ml-2"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom stealth admin access as requested: "Hidden admin access - do not display public login links on navigation" */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-600">
          <span>Engineered with Next.js, Three.js, MongoDB &amp; TypeScript</span>
          <Link
            href="/admin/login"
            className="text-zinc-700 hover:text-zinc-500 transition-colors flex items-center gap-1"
            title="Administrator Portal"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
