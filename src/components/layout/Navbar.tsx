"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Terminal } from "lucide-react";

interface NavbarProps {
  name?: string;
  isOpenToWork?: boolean;
}

export default function Navbar({
  name = "Siddhesh Korade",
  isOpenToWork = true,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Contacts", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#070709]/85 backdrop-blur-xl border-b border-white/[0.08] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Name */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-white font-medium tracking-tight text-base sm:text-lg"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform shadow-[0_0_8px_#38bdf8]" />
          <span className="font-semibold tracking-tight">{name}</span>
          <span className="hidden sm:inline-block text-xs font-mono text-zinc-500 uppercase tracking-widest ml-1">
            / Full-Stack
          </span>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 glass-pill px-4 py-1.5 rounded-full border border-white/10 shadow-lg shadow-black/40">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-1 text-xs uppercase tracking-wider font-mono text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-full transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side: Status indicator & Quick Resume CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {isOpenToWork && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Hire</span>
            </div>
          )}

          <a
            href="#contact"
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-semibold tracking-wide transition-all shadow-md"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white glass-pill rounded-full"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 mt-2 mx-4 rounded-2xl animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-mono text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for Hire
              </div>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-semibold"
              >
                Let&apos;s Talk
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
