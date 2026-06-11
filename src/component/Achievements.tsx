"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import BorderGlow from "./BorderGlow";
import {
  Megaphone,
  Trophy,
  Crown,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

const achievements = [
  {
    icon: Megaphone,
    title: "Resource Speaker",
    description:
      "Served as a resource speaker for children's computer literacy programs, demonstrating Microsoft Word fundamentals to prepare young learners for their junior high school journey. Shared essential digital skills that empowered students to confidently navigate technology in their academic pursuits.",
  },
  {
    icon: Trophy,
    title: "Award-Winning Developer",
    description:
      "Won numerous system-building competitions over the course of three years, earning multiple prestigious titles including Best Programmer Awardee, Best System Functionality, Best System Design, Best System Presentation, and Best Overall System — a testament to consistent excellence in software development.",
  },
  {
    icon: Crown,
    title: "Student Leader",
    description:
      "Served as Organization President for two consecutive years, widely recognized among peers for being helpful, dedicated, and a role model. Led with integrity, fostered a collaborative environment, and inspired fellow members to grow both personally and professionally.",
  },
];

export default function Achievements() {
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
    <section className="relative w-full bg-[#0e0013] py-32 px-6 md:px-16 lg:px-24">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h2
            className="text-white text-5xl font-light tracking-tight"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            Achievements
          </h2>
          <span className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
            <span className="text-xs font-mono tracking-widest uppercase text-white/50">
              Recognition
            </span>
          </span>
        </div>
        <p className="text-white/30 text-sm font-mono max-w-lg mx-auto leading-relaxed">
          Highlights of recognition, leadership, and contributions throughout my academic journey.
        </p>
      </div>

      {/* Carousel */}
      <div className="max-w-5xl mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {achievements.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_42%] min-w-0">
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
                    <div className="p-10 flex flex-col items-center text-center h-full">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-white/[0.02]">
                        <Icon size={28} weight="fill" color="rgba(255,255,255,0.6)" />
                      </div>

                      {/* Title */}
                      <h3
                        className="text-white text-xl font-light mb-4"
                        style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                      >
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/40 text-sm font-mono leading-[1.8]">
                        {item.description}
                      </p>
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
      <div className="mt-20 w-px h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
