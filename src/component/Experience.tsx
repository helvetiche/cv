"use client";

import { useState } from "react";
import BorderGlow from "./BorderGlow";
import {
  CaretDown,
  Calendar,
  Rocket,
  Code,
  PaintBrush,
  Briefcase,
  GraduationCap,
} from "@phosphor-icons/react";

interface ExperienceItem {
  year: string;
  title: string;
  company: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  icon: React.ElementType;
}

const experienceData: ExperienceItem[] = [
  {
    year: "2025 — 2026",
    title: "Freelance Developer",
    company: "Self-Employed",
    description:
      "Building modern web applications for clients across various industries, delivering end-to-end solutions from concept to deployment.",
    responsibilities: [
      "Developed custom web applications using React, Next.js, and TypeScript",
      "Implemented responsive designs with modern UI/UX principles",
      "Integrated third-party APIs and payment systems",
      "Managed full project lifecycle and client relationships",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    icon: Rocket,
  },
  {
    year: "2024 — 2025",
    title: "Web Development Intern",
    company: "Tech Solutions Inc.",
    description:
      "Contributed to client projects while learning industry best practices in a fast-paced agency environment.",
    responsibilities: [
      "Developed and maintained client websites using modern JavaScript frameworks",
      "Collaborated with design team to implement pixel-perfect UI components",
      "Optimized website performance achieving 40% faster load times",
      "Participated in code reviews and agile development processes",
    ],
    technologies: ["JavaScript", "React", "SCSS", "Git", "Figma"],
    icon: Code,
  },
  {
    year: "2023 — 2024",
    title: "UI/UX Design Assistant",
    company: "Creative Digital Agency",
    description:
      "Supported the design team in creating intuitive user experiences and visually appealing interfaces.",
    responsibilities: [
      "Created wireframes and prototypes for mobile and web applications",
      "Conducted user research and usability testing sessions",
      "Designed brand identities and marketing materials",
      "Collaborated with developers to ensure design feasibility",
    ],
    technologies: ["Figma", "Adobe XD", "Illustrator", "Photoshop"],
    icon: PaintBrush,
  },
  {
    year: "2022 — 2023",
    title: "Junior Developer",
    company: "StartUp Hub",
    description:
      "Started my professional journey building foundational skills in web development and team collaboration.",
    responsibilities: [
      "Built responsive landing pages and marketing websites",
      "Assisted senior developers with bug fixes and feature implementations",
      "Learned version control with Git and collaborative workflows",
      "Contributed to internal tools and documentation",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "WordPress", "Git"],
    icon: Briefcase,
  },
  {
    year: "2022",
    title: "BS Information Technology",
    company: "Marian College of Baliuag",
    description:
      "Graduated Magna Cum Laude, specializing in web development and emerging technologies.",
    responsibilities: [
      "Graduated Magna Cum Laude with GWA of 1.19",
      "Specialized in web development and emerging technologies",
      "Completed capstone project on AI-powered systems",
      "Active member of programming and tech clubs",
    ],
    technologies: ["Java", "Python", "MySQL", "Networking", "Systems Analysis"],
    icon: GraduationCap,
  },
];

function TimelineCard({ item, index }: { item: ExperienceItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = item.icon;

  return (
    <div className="relative flex group">
      {/* Timeline Line & Dot - Fixed left */}
      <div className="flex flex-col items-center pl-20 pr-8">
        {/* Dot with Icon */}
        <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#0e0013] transition-all duration-300 group-hover:scale-110 group-hover:border-white/40">
          <Icon size={16} weight="fill" color="rgba(255,255,255,0.7)" />
        </div>
        {/* Line */}
        {index < experienceData.length - 1 && (
          <div className="w-px flex-1 min-h-[40px] mt-4 bg-gradient-to-b from-white/20 to-transparent" />
        )}
      </div>

      {/* Card Content - Full Width */}
      <div className="flex-1 pr-20 pb-12">
        <BorderGlow
          edgeSensitivity={30}
          glowColor="0 0 100"
          backgroundColor="#120F17"
          borderRadius={20}
          glowRadius={30}
          glowIntensity={0.5}
          coneSpread={25}
          animated={false}
          colors={["#ffffff", "#ffffff", "#ffffff"]}
        >
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} weight="fill" color="rgba(255,255,255,0.5)" />
                <span className="text-sm font-mono tracking-wider uppercase text-white/50">
                  {item.year}
                </span>
              </div>
              <h3
                className="text-white text-2xl font-light mb-1"
                style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
              >
                {item.title}
              </h3>
              <p className="text-white/40 text-sm font-mono tracking-wide">
                {item.company}
              </p>
            </div>

            {/* Description */}
            <p
              className="text-white/50 text-base leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
            >
              {item.description}
            </p>

            {/* Responsibilities */}
            <div className="mb-6">
              <p className="text-white/25 text-xs font-mono uppercase tracking-widest mb-3">
                Key Responsibilities
              </p>
              <ul className="space-y-2">
                {(isExpanded ? item.responsibilities : item.responsibilities.slice(0, 2)).map(
                  (resp, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-white/40 text-sm font-mono leading-relaxed"
                    >
                      <span className="text-white/20 mt-1">▹</span>
                      {resp}
                    </li>
                  )
                )}
              </ul>
              {item.responsibilities.length > 2 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 mt-4 text-xs font-mono uppercase tracking-wider text-white/40 hover:text-white/60 transition-colors duration-200"
                >
                  {isExpanded ? "Show less" : `Show ${item.responsibilities.length - 2} more`}
                  <CaretDown
                    size={12}
                    weight="bold"
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>

            {/* Technologies */}
            <div>
              <p className="text-white/25 text-xs font-mono uppercase tracking-widest mb-3">
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border border-white/10 text-white/40 bg-white/[0.03] transition-all duration-200 hover:border-white/20 hover:text-white/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section className="relative w-full bg-[#0e0013] min-h-screen py-20">
      {/* Section Header */}
      <div className="mb-16 pl-20">
        <h2
          className="text-white text-6xl font-light tracking-tight mb-4"
          style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
        >
          Experience
        </h2>
        <p className="text-white/30 text-sm font-mono max-w-xl leading-relaxed">
          My professional journey and academic milestones from 2022 to 2026.
        </p>
      </div>

      {/* Timeline - Full Width */}
      <div className="w-full">
        {experienceData.map((item, index) => (
          <TimelineCard key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
