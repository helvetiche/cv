"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";
import {
  FaCertificate,
  FaCaretLeft,
  FaCaretRight,
  FaLink,
} from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";

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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start", containScroll: "trimSnaps" });
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full bg-[#000000] py-12 md:py-16 lg:py-24 overflow-hidden">
      {/* Grid Background */}
      <GridBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4 md:px-8 lg:px-20">
          <h2
            className="text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4 md:mb-6"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            Certifications
          </h2>
          <p className="text-white/30 text-xs md:text-sm font-mono max-w-lg mx-auto leading-relaxed px-2">
            Professional certifications and continuous learning milestones.
          </p>
        </div>

        {/* Carousel */}
        <div className="w-full px-4 md:px-8 lg:px-20">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_45%] lg:flex-[0_0_38%] min-w-0 self-stretch"
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
                    className="h-full"
                  >
                    <div className="p-4 md:p-6 lg:p-8 flex flex-col h-full min-h-[220px] md:min-h-[240px]">
                      {/* Header */}
                      <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] shrink-0">
                          <FaCertificate size={18} className="text-white/60 md:w-[22px] md:h-[22px]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-white text-base md:text-lg font-light mb-0.5 md:mb-1"
                            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                          >
                            {cert.title}
                          </h3>
                          <p className="text-white/40 text-xs md:text-sm font-mono truncate">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-white/40 text-xs md:text-sm font-mono leading-relaxed text-justify mb-4 md:mb-6 flex-1">
                        {cert.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <GiGraduateCap size={12} className="text-white/30 md:w-3.5 md:h-3.5" />
                          <span className="text-white/30 text-[10px] md:text-xs font-mono">
                            Issued {cert.date}
                          </span>
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 md:gap-1.5 text-white/40 hover:text-white/70 transition-colors text-[10px] md:text-xs font-mono"
                          >
                            <FaLink size={10} className="md:w-3 md:h-3" />
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
          <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 md:mt-10">
            <button
              onClick={scrollPrev}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
            >
              <FaCaretLeft size={14} className="md:w-4 md:h-4" />
            </button>

            <div className="flex gap-1.5 md:gap-2">
              {certifications.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`h-1.5 md:h-2 rounded-full transition-all ${
                    selectedIndex === i ? "bg-white/70 w-3 md:w-4" : "bg-white/20 w-1 md:w-1.5 hover:bg-white/40"
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
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-8 md:mt-12 lg:mt-16 w-px h-12 md:h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
