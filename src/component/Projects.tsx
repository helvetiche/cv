"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";
import {
  CaretLeft,
  CaretRight,
  Rocket,
  GraduationCap,
  User,
  Globe,
  GithubLogo,
  Folder,
} from "@phosphor-icons/react";

/* ============================================
   PROJECT DATA
   ============================================ */
type ProjectCategory = "freelance" | "academic" | "personal";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  category: ProjectCategory;
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with real-time inventory management, secure payment processing, and an intuitive admin dashboard for store owners.",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
    images: ["/projects/placeholder-1.svg"],
    category: "freelance",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "AI-Powered Task Manager",
    description:
      "Smart task management application leveraging AI to automatically prioritize, categorize, and suggest optimal scheduling for daily workflows.",
    technologies: ["React", "OpenAI", "Node.js", "MongoDB", "Redis"],
    images: ["/projects/placeholder-2.svg"],
    category: "personal",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Student Portal System",
    description:
      "Comprehensive academic portal for student enrollment, grade tracking, class scheduling, and faculty communication — built for a college client.",
    technologies: ["Next.js", "Prisma", "MySQL", "Firebase", "Tailwind CSS"],
    images: ["/projects/placeholder-3.svg"],
    category: "academic",
    liveUrl: "#",
  },
  {
    title: "Real-Time Analytics Dashboard",
    description:
      "Interactive dashboard for visualizing business metrics with live data streaming, custom report generation, and exportable insights.",
    technologies: ["React", "D3.js", "WebSocket", "Node.js", "InfluxDB"],
    images: ["/projects/placeholder-4.svg"],
    category: "freelance",
    githubUrl: "#",
  },
  {
    title: "Mobile Health Tracker",
    description:
      "Cross-platform health and fitness tracking app with workout plans, nutrition logging, progress charts, and social sharing features.",
    technologies: ["React Native", "Expo", "Supabase", "TypeScript", "Chart.js"],
    images: ["/projects/placeholder-5.svg"],
    category: "personal",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Document Automation Tool",
    description:
      "Automated document generation and processing system that reduced manual accounting workflows by 95% — built during internship.",
    technologies: ["Node.js", "Excel JS", "JavaScript", "Automation"],
    images: ["/projects/placeholder-6.svg"],
    category: "academic",
  },
  {
    title: "Social Media Scheduler",
    description:
      "Multi-platform social media management tool with content calendar, auto-posting, analytics tracking, and team collaboration features.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "OAuth", "Cron"],
    images: ["/projects/placeholder-7.svg"],
    category: "freelance",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Capstone: Smart Campus System",
    description:
      "IoT-integrated campus management system for room booking, attendance tracking, facility monitoring, and student services — award-winning capstone project.",
    technologies: ["React", "Node.js", "MQTT", "MongoDB", "Raspberry Pi"],
    images: ["/projects/placeholder-8.svg"],
    category: "academic",
  },
];

/* ============================================
   FILTER PILLS
   ============================================ */
const filterPills = [
  { label: "All", icon: Folder, value: "all" as const },
  { label: "Freelance", icon: Rocket, value: "freelance" as const },
  { label: "Academic", icon: GraduationCap, value: "academic" as const },
  { label: "Personal", icon: User, value: "personal" as const },
];

/* ============================================
   IMAGE CAROUSEUSEL (Inside each card)
   ============================================ */
function ProjectImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-t-xl" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                  <span className="text-white/20 text-sm font-mono">{title}</span>
                </div>
                <img
                  src={src}
                  alt={`${title} screenshot ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator - hide on mobile if too many */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 max-w-[60%] overflow-hidden">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 shrink-0 ${
                selectedIndex === i ? "bg-white/80 w-3" : "bg-white/30 w-1"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================
   PROJECT CARD
   ============================================ */
function ProjectCard({ project }: { project: Project }) {
  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="0 0 100"
      backgroundColor="#0a0a0a"
      borderRadius={16}
      glowRadius={20}
      glowIntensity={0.3}
      coneSpread={25}
      animated={false}
      colors={["#ffffff", "#ffffff", "#ffffff"]}
    >
      <div className="flex flex-col">
        {/* Image Area */}
        <ProjectImageCarousel images={project.images} title={project.title} />

        {/* Content Area */}
        <div className="p-4 md:p-6 flex flex-col flex-1">
          {/* Title */}
          <h3
            className="text-white text-lg md:text-xl font-light mb-2 md:mb-3"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-white/40 text-xs md:text-sm font-mono leading-relaxed mb-3 md:mb-4 text-justify">
            {project.description}
          </p>

          {/* Tech Tags */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-[11px] font-mono tracking-wide border border-white/10 text-white/40 bg-white/[0.03]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 mt-auto pt-3 md:pt-4 border-t border-white/5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-[10px] md:text-xs font-mono uppercase tracking-wide"
              >
                <Globe size={12} weight="bold" className="md:w-3.5 md:h-3.5" />
                Live
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-[10px] md:text-xs font-mono uppercase tracking-wide"
              >
                <GithubLogo size={12} weight="bold" className="md:w-3.5 md:h-3.5" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}

/* ============================================
   MAIN COMPONENT - Projects Section
   ============================================ */
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const filteredProjects =
    activeFilter === 0
      ? projects
      : projects.filter((p) => p.category === filterPills[activeFilter].value);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full bg-[#000000] py-12 md:py-16 lg:py-24 overflow-hidden min-h-screen">
      {/* Grid Background */}
      <GridBackground />

      {/* Section Header */}
      <div className="relative z-10 text-center mb-8 md:mb-12 lg:mb-16 px-4 md:px-8 lg:px-20">
        <h2
          className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-4 md:mb-6 lg:mb-8"
          style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
        >
          Projects
        </h2>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6 overflow-x-auto scrollbar-hide pb-2">
          {filterPills.map((pill, index) => {
            const PillIcon = pill.icon;
            const isActive = activeFilter === index;
            return (
              <button
                key={pill.label}
                onClick={() => setActiveFilter(index)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-white/10 border-white/30 text-white"
                    : "bg-transparent border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                }`}
              >
                <PillIcon size={14} weight="fill" className="md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-mono tracking-wide uppercase">
                  {pill.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-white/30 text-xs md:text-sm font-mono max-w-2xl mx-auto leading-relaxed px-2">
          A collection of projects spanning freelance work, academic endeavors, and personal explorations — each representing a unique challenge and learning experience.
        </p>
      </div>

      {/* Projects Carousel */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-20">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={`${activeFilter}-${index}`}
                className="flex-[0_0_95%] sm:flex-[0_0_75%] md:flex-[0_0_48%] lg:flex-[0_0_38%] min-w-0"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 md:mt-10">
          <button
            onClick={scrollPrev}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
          >
            <CaretLeft size={14} weight="bold" className="md:w-4 md:h-4" />
          </button>

          <div className="flex gap-1 md:gap-1.5 max-w-[120px] md:max-w-none overflow-hidden">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-1 md:h-1.5 rounded-full transition-all shrink-0 ${
                  selectedIndex === i ? "bg-white/70 w-2.5 md:w-3" : "bg-white/20 w-1 md:w-1.5 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
          >
            <CaretRight size={14} weight="bold" className="md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-8 md:mt-12 lg:mt-16 w-px h-12 md:h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
