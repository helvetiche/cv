"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";
import {
  Certificate,
  CaretLeft,
  CaretRight,
  SealCheck,
  GraduationCap,
  Trophy,
  Link,
} from "@phosphor-icons/react";

interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  description: string;
}

const certifications: Certification[] = [
  {
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2025",
    credentialUrl: "#",
    description:
      "Foundational understanding of AWS Cloud services, architecture, security, and pricing models.",
  },
  {
    title: "Meta Front-End Developer",
    issuer: "Meta (Coursera)",
    date: "2024",
    credentialUrl: "#",
    description:
      "Professional certificate covering React, JavaScript, UI/UX principles, and version control.",
  },
  {
    title: "Google IT Support",
    issuer: "Google (Coursera)",
    date: "2024",
    credentialUrl: "#",
    description:
      "Comprehensive IT support training including troubleshooting, networking, and system administration.",
  },
  {
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    date: "2023",
    credentialUrl: "#",
    description:
      "Mastered HTML, CSS, and modern responsive design techniques for building accessible websites.",
  },
  {
    title: "JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    date: "2023",
    credentialUrl: "#",
    description:
      "Deep dive into JavaScript fundamentals, ES6+, algorithms, and data structure implementation.",
  },
];

export default function Certifications() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
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
    <section className="relative w-full bg-[#000000] py-24 overflow-hidden">
      {/* Grid Background */}
      <GridBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 px-20">
          <h2
            className="text-white text-5xl font-light tracking-tight mb-6"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            Certifications
          </h2>
          <p className="text-white/30 text-sm font-mono max-w-lg mx-auto leading-relaxed">
            Professional certifications and continuous learning milestones.
          </p>
        </div>

        {/* Carousel */}
        <div className="w-full px-20">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex-[0_0_80%] md:flex-[0_0_45%] lg:flex-[0_0_38%] min-w-0"
                >
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
                    <div className="p-8 flex flex-col h-[280px]">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] shrink-0">
                          <Certificate size={22} weight="fill" color="rgba(255,255,255,0.6)" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-white text-lg font-light mb-1"
                            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                          >
                            {cert.title}
                          </h3>
                          <p className="text-white/40 text-sm font-mono">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-white/40 text-sm font-mono leading-relaxed text-justify mb-6 flex-1">
                        {cert.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={14} weight="fill" color="rgba(255,255,255,0.3)" />
                          <span className="text-white/30 text-xs font-mono">
                            Issued {cert.date}
                          </span>
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-xs font-mono"
                          >
                            <Link size={12} weight="bold" />
                            Verify
                          </a>
                        )}
                      </div>
                    </div>
                  </BorderGlow>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
            >
              <CaretLeft size={16} weight="bold" />
            </button>

            <div className="flex gap-2">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    selectedIndex === i ? "bg-white/70 w-6" : "bg-white/20 w-2 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-16 w-px h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
