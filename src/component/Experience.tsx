"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";
import {
  Calendar,
  Rocket,
  Code,
  PaintBrush,
  GraduationCap,
  CaretLeft,
  CaretRight,
  ListChecks,
  Briefcase,
} from "@phosphor-icons/react";

/* ============================================
   FILTER PILLS
   ============================================ */
const filterPills = [
  { label: "All", icon: Briefcase },
  { label: "Work", icon: Code },
  { label: "Leadership", icon: GraduationCap },
];

/* ============================================
   DATA - Experience Items
   ============================================ */
interface ExperienceItem {
  year: string;
  title: string;
  company: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  icon: React.ElementType;
  images: string[];
  category: "work" | "leadership";
}

const experienceData: ExperienceItem[] = [
  {
    year: "2024 — Present",
    title: "Freelance Developer",
    company: "Self-Employed",
    description:
      "Building modern web applications for clients across various industries, delivering end-to-end solutions from concept to deployment for both students and business.",
    responsibilities: [
      "Fulfill clients' custom features and revisions",
      "Maintain system's continuous integration",
      "Discuss features and implementations with clients",
      "Research for the best practices based on the client's requirements",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Firebase", "Redis", "Upstash", "Tailwind CSS"],
    icon: Rocket,
    images: [
      "/freelancing/image-1.png",
      "/freelancing/image-2.png",
      "/freelancing/image-3.png",
      "/freelancing/image-4.png",
    ],
    category: "work",
  },
  {
    year: "2024 — 2025",
    title: "Web Developer Intern",
    company: "National Irrigation Administration - BANEIMO R3",
    description:
      "Automated manual accounting workflows using Node.js-based Excel manipulation, reducing weekly data encoding tasks from days to under 5 minutes — a 95% reduction in time consumed.",
    responsibilities: [
      "Built Excel automation tools using Node.js to streamline accounting processes",
      "Reduced manual data encoding time by 95%, turning weeks of work into minutes",
      "Collaborated with staff to understand workflow pain points and requirements",
      "Documented system processes and provided user training",
    ],
    technologies: ["Node.js", "JavaScript", "Excel", "Automation"],
    icon: Code,
    images: [
      "/intern/image-1.png",
      "/intern/image-2.png",
      "/intern/image-3.png",
      "/intern/image-4.png",
    ],
    category: "work",
  },
  {
    year: "2023 — 2025",
    title: "Organization President",
    company: "CICS - College of Information and Computer Studies",
    description:
      "Led an IT organization dedicated to fostering growth through educational initiatives, workshops, seminars, competitions, and fundraising events — creating an engaging and enriching experience for college students.",
    responsibilities: [
      "Directed organization operations and strategic planning for IT-focused events",
      "Organized educational workshops, seminars, and technical competitions",
      "Coordinated fundraising events to support organization activities and member development",
      "Mentored members in technical skills and professional growth",
    ],
    technologies: ["Leadership", "Event Management", "Public Speaking", "Team Building"],
    icon: GraduationCap,
    images: [
      "/cics/image-1.png",
      "/cics/image-2.png",
      "/cics/image-3.png",
      "/cics/image-4.png",
    ],
    category: "leadership",
  },
  {
    year: "2022 — 2023",
    title: "Social Media Manager",
    company: "CICS - College of Information and Computer Studies",
    description:
      "Managed the official Facebook page of the organization, serving as the primary voice for public communications. Crafted engaging content, published event announcements, and kept the community informed about upcoming activities, workshops, and organizational updates.",
    responsibilities: [
      "Managed and maintained the organization's official Facebook page",
      "Created and published public announcements, event updates, and promotional content",
      "Engaged with the online community to foster awareness and participation",
      "Coordinated with the events team to ensure timely and accurate information dissemination",
    ],
    technologies: ["Social Media Management", "Content Creation", "Facebook", "Communication"],
    icon: PaintBrush,
    images: [
      "/smm/image-1.png",
      "/smm/image-2.png",
      "/smm/image-3.png",
      "/smm/image-4.png",
    ],
    category: "leadership",
  },
  {
    year: "2022",
    title: "Film Director",
    company: "SIKRETONG LIPUNAN (Secret Society) - Star Productions",
    description:
      "Directed a short film exploring friendship and mystery as a group of friends uncover the truth behind their missing companions — only to discover it was all a dream, or was it? The film blurred the lines between reality and illusion, delivering a thought-provoking narrative.",
    responsibilities: [
      "Directed the short film from pre-production to final cut",
      "Oversaw cinematography, editing, and original soundtrack production",
      "Led the creative team in script development and visual storytelling",
      "Managed production timelines and coordinated with cast and crew",
    ],
    technologies: ["Film Direction", "Cinematography", "Editing", "Scriptwriting", "Sound Design"],
    icon: GraduationCap,
    images: [
      "/film/image-1.png",
      "/film/image-2.png",
      "/film/image-3.png",
      "/film/image-4.png",
    ],
    category: "leadership",
  },
];

/* ============================================
   COMPONENT - Image Carousel (Right Side)
   ============================================ */
function ImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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
    <div className="relative w-full flex flex-col h-full">
      {/* Carousel Viewport - 16:9 */}
      <div className="overflow-hidden rounded-lg flex-1" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 h-full">
              <div className="relative w-full h-full" style={{ paddingBottom: "56.25%" }}>
                <img
                  src={src}
                  alt={`Project ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
          >
            <CaretLeft size={14} weight="bold" />
          </button>
          <button
            onClick={scrollNext}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
          >
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
        <div className="flex gap-1.5">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                selectedIndex === i ? "bg-white/70 w-4" : "bg-white/20 w-1.5 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   COMPONENT - Timeline Card
   Left Side: Info | Right Side: Carousel
   ============================================ */
function TimelineCard({ item, index, isLast }: { item: ExperienceItem; index: number; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = item.icon;

  return (
    <article className="relative flex flex-col md:flex-row group">
      {/* ---- TIMELINE DOT & LINE (Far Left) ---- */}
      <div className="flex flex-col items-center pl-4 md:pl-8 lg:pl-20 pr-4 md:pr-6 lg:pr-10 relative">
        <div className="relative z-10 flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/20 bg-[#000000] transition-all duration-300 group-hover:scale-110 group-hover:border-white/50">
          <Icon size={16} weight="fill" color="rgba(255,255,255,0.8)" className="md:w-[18px] md:h-[18px]" />
        </div>

      </div>

      {/* ---- CARD CONTENT (50/50 Split on desktop, stacked on mobile) ---- */}
      <div className="flex-1 pr-4 md:pr-8 lg:pr-20 pb-8 md:pb-12">
        <BorderGlow
          edgeSensitivity={30}
          glowColor="0 0 100"
          backgroundColor="#120F17"
          borderRadius={16}
          glowRadius={20}
          glowIntensity={0.3}
          coneSpread={25}
          animated={false}
          colors={["#ffffff", "#ffffff", "#ffffff"]}
        >
          <div className="flex flex-col md:flex-row min-h-[280px] md:min-h-[340px]">
            {/* ======== LEFT SIDE: Info (50% on desktop, full on mobile) ======== */}
            <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-10 flex flex-col">
              {/* Period */}
              <header className="mb-4 md:mb-6 lg:mb-8">
                <div className="flex items-center gap-2 mb-2 md:mb-4">
                  <Calendar size={12} weight="fill" color="rgba(255,255,255,0.4)" className="md:w-3.5 md:h-3.5" />
                  <time className="text-xs md:text-sm font-mono tracking-widest uppercase text-white/40">
                    {item.year}
                  </time>
                </div>
                <h3
                  className="text-white text-xl md:text-2xl lg:text-3xl font-light leading-tight mb-1 md:mb-2"
                  style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/40 text-sm md:text-base font-mono tracking-wide">
                  {item.company}
                </p>
              </header>

              {/* Description */}
              <p
                className="text-white/50 text-sm md:text-base lg:text-lg leading-relaxed md:leading-[1.8] mb-4 md:mb-6 lg:mb-8"
                style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
              >
                {item.description}
              </p>

              {/* Responsibilities */}
              <div className="mb-4 md:mb-6 lg:mb-8">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <ListChecks size={12} weight="fill" color="rgba(255,255,255,0.3)" className="md:w-3.5 md:h-3.5" />
                  <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-white/30">
                    Responsibilities
                  </span>
                </div>
                <ul className="space-y-2 md:space-y-3">
                  {(isExpanded ? item.responsibilities : item.responsibilities.slice(0, 2)).map(
                    (resp, i) => (
                      <li key={i} className="flex items-start gap-2 md:gap-3 text-white/45 text-xs md:text-sm lg:text-base font-mono leading-relaxed">
                        <span className="text-white/20 mt-0.5 shrink-0">▹</span>
                        <span>{resp}</span>
                      </li>
                    )
                  )}
                </ul>
                {item.responsibilities.length > 2 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 md:mt-4 text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/35 hover:text-white/55 transition-colors"
                  >
                    {isExpanded ? "Show less" : `+${item.responsibilities.length - 2} more`}
                  </button>
                )}
              </div>

              {/* Technologies */}
              <footer className="mt-auto">
                <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-white/25 block mb-2 md:mb-3">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {item.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-mono tracking-wide border border-white/10 text-white/40 bg-white/[0.03]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </footer>
            </div>

            {/* ======== RIGHT SIDE: Carousel (50% on desktop, full on mobile) ======== */}
            <div className="w-full md:w-1/2 p-3 md:p-4 lg:p-6 flex items-center">
              <ImageCarousel images={item.images} />
            </div>
          </div>
        </BorderGlow>
      </div>
    </article>
  );
}

/* ============================================
   MAIN COMPONENT - Experience Section
   ============================================ */
export default function Experience() {
  const [activeFilter, setActiveFilter] = useState(0);

  const filteredData = activeFilter === 0
    ? experienceData
    : activeFilter === 1
      ? experienceData.filter((item) => item.category === "work")
      : experienceData.filter((item) => item.category === "leadership");

  return (
    <section className="relative w-full min-h-screen py-12 md:py-16 lg:py-24 overflow-hidden">

      {/* Base Background Color */}
      <div className="absolute inset-0 bg-[#000000] z-0" />

      {/* Grid Background with Vignette */}
      <div className="absolute inset-0 z-1">
        <GridBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">

      {/* Section Header */}
      <header className="mb-10 md:mb-16 lg:mb-20 text-center px-4 md:px-8">
        <h2
          className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-4 md:mb-6 lg:mb-8"
          style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
        >
          Experience
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

        <p className="text-white/25 text-xs md:text-sm font-mono max-w-2xl mx-auto leading-relaxed px-2">
          A timeline of professional growth, leadership roles, and creative endeavors — from freelance development and internships to student organization leadership and film production.
        </p>
      </header>

      {/* Timeline */}
      <div className="w-full">
        {filteredData.map((item, index) => (
          <TimelineCard
            key={`${activeFilter}-${index}`}
            item={item}
            index={index}
            isLast={index === filteredData.length - 1}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
