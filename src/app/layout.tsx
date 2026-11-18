import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siddhesh Korade | MERN Stack & Full-Stack Developer",
  description: "Personal Portfolio of Siddhesh Korade - MERN Stack Developer, React.js, Node.js, and Full-Stack Web Developer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#070709] text-[#e2e8f0] antialiased selection:bg-purple-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
