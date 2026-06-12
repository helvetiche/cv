"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";
import {
  Megaphone,
  Trophy,
  Crown,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Star,
  Users,
  Medal,
  Presentation,
  Handshake,
} from "@phosphor-icons/react";

const filterPills = [
  { label: "All", icon: Star },
  { label: "Speaking", icon: Megaphone },
  { label: "Leadership", icon: Crown },
];

const achievements = [
  {
    icon: Megaphone,
    title: "Resource Speaker",
    category: "speaking",
    description:
      "Served as a resource speaker for children's computer literacy programs, demonstrating Microsoft Word fundamentals to prepare young learners for their junior high school journey. Shared essential digital skills that empowered students to confidently navigate technology in their academic pursuits.",
    highlights: [
      { icon: Presentation, label: "Computer Literacy" },
      { icon: Users, label: "Children & Students" },
      { icon: CheckCircle, label: "Microsoft Word" },
    ],
  },
  {
    icon: Trophy,
    title: "Award-Winning Developer",
    category: "awards",
    description:
      "Won numerous system-building competitions over the course of three years, earning multiple prestigious titles including Best Programmer Awardee, Best System Functionality, Best System Design, Best System Presentation, and Best Overall System — a testament to consistent excellence in software development.",
    highlights: [
      { icon: Medal, label: "Best Programmer" },
      { icon: Trophy, label: "Best Overall System" },
      { icon: Star, label: "3 Years Winning" },
    ],
  },
  {
    icon: Crown,
    title: "Student Leader",
    category: "leadership",
    description:
      "Served as Organization President for two consecutive years, widely recognized among peers for being helpful, dedicated, and a role model. Led with integrity, fostered a collaborative environment, and inspired fellow members to grow both personally and professionally.",
    highlights: [
      { icon: Crown, label: "2 Years President" },
      { icon: Handshake, label: "Team Builder" },
      { icon: Users, label: "50+ Members" },
    ],
  },
];

export default function Achievements() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const filteredAchievements = activeFilter === 0
    ? achievements
    : activeFilter === 1
      ? achievements.filter((a) => a.category === "speaking")
      : achievements.filter((a) => a.category === "leadership" || a.category === "awards");

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

      {/* Grid Background with Vignette */}
      <GridBackground />

      {/* Section Header */}
      <div className="text-center mb-16 px-20">
        <h2
          className="text-white text-5xl font-light tracking-tight mb-8"
          style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
        >
          Achievements
        </h2>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {filterPills.map((pill, index) => {
            const PillIcon = pill.icon;
            const isActive = activeFilter === index;
            return (
              <button
                key={pill.label}
                onClick={() => setActiveFilter(index)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 border-white/30 text-white"
                    : "bg-transparent border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                }`}
              >
                <PillIcon size={16} weight="fill" />
                <span className="text-sm font-mono tracking-wide uppercase">
                  {pill.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-white/30 text-sm font-mono max-w-lg mx-auto leading-relaxed">
          Highlights of recognition, leadership, and contributions throughout my academic journey.
        </p>
      </div>

      {/* Carousel */}
      <div className="w-full px-20">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {filteredAchievements.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={`${activeFilter}-${index}`} className="flex-[0_0_80%] md:flex-[0_0_45%] lg:flex-[0_0_40%] min-w-0">
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
                    <div className="p-8 flex flex-col h-[380px]">
                      {/* Header with Icon */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] shrink-0">
                          <Icon size={24} weight="fill" color="rgba(255,255,255,0.6)" />
                        </div>
                        <h3
                          className="text-white text-xl font-light"
                          style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                        >
                          {item.title}
                        </h3>
                      </div>

                      {/* Description - Justified */}
                      <p
                        className="text-white/40 text-sm font-mono leading-[1.9] text-justify mb-6"
                      >
                        {item.description}
                      </p>

                      {/* Highlight Pills */}
                      <div className="mt-auto">
                        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/20 block mb-3">
                          Highlights
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.highlights.map((highlight, i) => {
                            const HighlightIcon = highlight.icon;
                            return (
                              <span
                                key={i}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]"
                              >
                                <HighlightIcon size={12} weight="fill" color="rgba(255,255,255,0.5)" />
                                <span className="text-xs font-mono tracking-wide text-white/50">
                                  {highlight.label}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </BorderGlow>
                </div>
              );
            })}
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

      {/* Divider */}
      <div className="mt-16 w-px h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
