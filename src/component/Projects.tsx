"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";
import { getProjects, type Project } from "../lib/projectsService";
import { getTechIcon } from "../lib/techIcons";
import {
  FaCaretLeft,
  FaCaretRight,
  FaGlobe,
  FaGithub,
} from "react-icons/fa";

/* ============================================
   TECH TAG WITH ICON
   ============================================ */
function TechTag({ tech, icon: Icon }: { tech: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-[11px] font-mono tracking-wide border border-white/10 text-white/50 bg-white/[0.03]">
      <Icon size={10} className="md:w-3 md:h-3 shrink-0" />
      {tech}
    </span>
  );
}

/* ============================================
   PROJECT IMAGE
   ============================================ */
function ProjectImage({ imageUrl, title }: { imageUrl: string; title: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full rounded-t-xl overflow-hidden">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        {hasError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
            <span className="text-white/20 text-sm font-mono">{title}</span>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={`${title} screenshot`}
            fill
            className="object-cover"
            unoptimized
            onError={() => setHasError(true)}
          />
        )}
      </div>
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
      <div className="flex flex-col h-full">
        {/* Image Area */}
        <ProjectImage imageUrl={project.imageUrl} title={project.title} />

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
          <p className="text-white/40 text-xs md:text-sm font-mono leading-relaxed mb-3 md:mb-4 text-justify line-clamp-4">
            {project.description}
          </p>

          {/* Tech Tags */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
            {project.tags.map((tech, i) => (
              <TechTag key={i} tech={tech} icon={getTechIcon(tech)} />
            ))}
          </div>

          {/* Links */}
          {(project.live || project.github) && (
            <div className="flex items-center gap-3 mt-auto pt-3 md:pt-4 border-t border-white/5">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-[10px] md:text-xs font-mono uppercase tracking-wide"
                >
                  <FaGlobe size={12} className="md:w-3.5 md:h-3.5" />
                  Live
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-[10px] md:text-xs font-mono uppercase tracking-wide"
                >
                  <FaGithub size={12} className="md:w-3.5 md:h-3.5" />
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </BorderGlow>
  );
}

/* ============================================
   LOADING SKELETON
   ============================================ */
function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden h-full flex flex-col">
      <div className="w-full animate-pulse shrink-0" style={{ paddingBottom: "56.25%", background: "rgba(255,255,255,0.03)" }} />
      <div className="p-4 md:p-6 space-y-3 flex-1 flex flex-col">
        <div className="h-5 bg-white/5 rounded w-2/3 animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-4/5 animate-pulse" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 bg-white/5 rounded-full w-16 animate-pulse" />
          <div className="h-5 bg-white/5 rounded-full w-14 animate-pulse" />
          <div className="h-5 bg-white/5 rounded-full w-12 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ============================================
   MAIN COMPONENT - Projects Section
   ============================================ */
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });

  // Fetch projects from Firestore
  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Re-initialize carousel when projects data changes
  useEffect(() => {
    if (!emblaApi || loading) return;
    emblaApi.reInit();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [projects, loading, emblaApi]);

  const displayItems = loading
    ? Array.from({ length: 4 }, (_, i) => ({ id: `skeleton-${i}` } as Project))
    : projects;

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

        {!loading && projects.length > 0 && (
          <p className="text-white/30 text-xs md:text-sm font-mono max-w-2xl mx-auto leading-relaxed px-2">
            A collection of {projects.length} projects spanning freelance work, academic endeavors, and personal explorations — each representing a unique challenge and learning experience.
          </p>
        )}
      </div>

      {/* Projects Carousel */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-20">
        {error ? (
          <div className="text-center py-12">
            <p className="text-white/50 font-mono text-sm">{error}</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 md:gap-6 items-stretch">
                {displayItems.map((project) =>
                  loading ? (
                    <div
                      key={project.id}
                      className="flex-[0_0_95%] sm:flex-[0_0_75%] md:flex-[0_0_48%] lg:flex-[0_0_38%] min-w-0 flex flex-col"
                    >
                      <ProjectCardSkeleton />
                    </div>
                  ) : (
                    <div
                      key={project.id}
                      className="flex-[0_0_95%] sm:flex-[0_0_75%] md:flex-[0_0_48%] lg:flex-[0_0_38%] min-w-0 flex flex-col"
                    >
                      <ProjectCard project={project} />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Navigation */}
            {!loading && projects.length > 0 && (
              <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 md:mt-10">
                <button
                  onClick={scrollPrev}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                >
                  <FaCaretLeft size={14} className="md:w-4 md:h-4" />
                </button>

                <div className="flex gap-1 md:gap-1.5 max-w-[120px] md:max-w-none overflow-hidden">
                  {displayItems.map((_, i) => (
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
                  <FaCaretRight size={14} className="md:w-4 md:h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-8 md:mt-12 lg:mt-16 w-px h-12 md:h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
