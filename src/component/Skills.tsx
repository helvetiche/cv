"use client";

import {
  Code,
  PaintBrush,
  Database,
  Cloud,
  DeviceMobile,
  Brain,
  GitBranch,
  Terminal,
  Globe,
  Cpu,
  Stack,
  Wrench,
  HardDrives,
} from "@phosphor-icons/react";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";

type SkillCategory = "frontend" | "backend" | "tools" | "cloud" | "other";

interface Skill {
  name: string;
  icon: React.ElementType;
  category: SkillCategory;
}

const skills: Skill[] = [
  // Frontend
  { name: "React", icon: Code, category: "frontend" },
  { name: "Next.js", icon: Globe, category: "frontend" },
  { name: "TypeScript", icon: Code, category: "frontend" },
  { name: "JavaScript", icon: Code, category: "frontend" },
  { name: "Tailwind CSS", icon: PaintBrush, category: "frontend" },
  { name: "HTML/CSS", icon: PaintBrush, category: "frontend" },

  // Backend
  { name: "Node.js", icon: Terminal, category: "backend" },
  { name: "Python", icon: Terminal, category: "backend" },
  { name: "PHP", icon: Code, category: "backend" },
  { name: "REST APIs", icon: Stack, category: "backend" },
  { name: "GraphQL", icon: Stack, category: "backend" },

  // Database
  { name: "PostgreSQL", icon: Database, category: "backend" },
  { name: "MongoDB", icon: Database, category: "backend" },
  { name: "MySQL", icon: Database, category: "backend" },
  { name: "Firebase", icon: Database, category: "backend" },
  { name: "Redis", icon: Database, category: "backend" },

  // Cloud & DevOps
  { name: "AWS", icon: Cloud, category: "cloud" },
  { name: "Vercel", icon: Cloud, category: "cloud" },
  { name: "Docker", icon: Cloud, category: "cloud" },
  { name: "Git", icon: GitBranch, category: "cloud" },
  { name: "CI/CD", icon: GitBranch, category: "cloud" },

  // Tools & Other
  { name: "Figma", icon: PaintBrush, category: "tools" },
  { name: "VS Code", icon: Terminal, category: "tools" },
  { name: "Linux", icon: Terminal, category: "tools" },
  { name: "Webpack", icon: Wrench, category: "tools" },
  { name: "Vite", icon: Wrench, category: "tools" },
];

const skillCategories = [
  { label: "All", value: "all" as const },
  { label: "Frontend", value: "frontend" as const },
  { label: "Backend", value: "backend" as const },
  { label: "Cloud & DevOps", value: "cloud" as const },
  { label: "Tools", value: "tools" as const },
];

export default function Skills() {
  return (
    <section className="relative w-full bg-[#000000] py-24 overflow-hidden">
      {/* Grid Background */}
      <GridBackground />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-white text-5xl font-light tracking-tight mb-6"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            Skills & Technologies
          </h2>
          <p className="text-white/30 text-sm font-mono max-w-lg mx-auto leading-relaxed">
            Technologies and tools I work with to bring ideas to life.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <BorderGlow
                key={skill.name}
                edgeSensitivity={20}
                glowColor="0 0 100"
                backgroundColor="#080808"
                borderRadius={12}
                glowRadius={15}
                glowIntensity={0.2}
                coneSpread={20}
                animated={false}
                colors={["#ffffff", "#ffffff", "#ffffff"]}
              >
                <div className="p-4 flex flex-col items-center justify-center gap-3 min-h-[100px]">
                  <Icon size={28} weight="duotone" color="rgba(255,255,255,0.5)" />
                  <span className="text-white/60 text-xs font-mono tracking-wide text-center">
                    {skill.name}
                  </span>
                </div>
              </BorderGlow>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-16 w-px h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
