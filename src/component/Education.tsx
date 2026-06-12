"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Student,
  GraduationCap,
  Medal,
  Trophy,
  Star,
  Code,
  Presentation,
  SealCheck,
  Handshake,
  Crown,
  Heart,
  BookOpen,
  Atom,
  Monitor,
  Globe,
  ChalkboardTeacher,
  Backpack, 
} from "@phosphor-icons/react";

const awards = [
  { label: "Magna Cum Laude (GWA: 1.19)", icon: Medal, gold: true },
  { label: "Outstanding Programmer Awardee", icon: Code, gold: false },
  { label: "Best in Application & Emerging Technologies", icon: Star, gold: false },
  { label: "Best Capstone Research Presentation Award", icon: Presentation, gold: false },
  { label: "Best in Web Programming", icon: Code, gold: false },
  { label: "Diligence Award", icon: SealCheck, gold: false },
  { label: "Synergy Award", icon: Handshake, gold: false },
  { label: "Leadership Award", icon: Crown, gold: false },
  { label: "Loyalty Award", icon: Heart, gold: false },
];

const educationData = [
  {
    year: "2022 - 2026",
    degree: "Bachelor of Science in Information Technology",
    school: "Marian College of Baliuag, Inc",
    description: "",
    badge: "Magna Cum Laude",
    badgeIcon: Medal,
    awards: awards,
  },
  {
    year: "2020 - 2022",
    degree: "Senior High School - Humanities and Social Sciences",
    school: "Marian College of Baliuag, Inc",
    description: "",
    badge: "With Honors",
    badgeIcon: Trophy,
    awards: [
      { label: "With Honors (Average: 91.5)", icon: Trophy, gold: true },
      { label: "Best HUMSS Research", icon: Presentation, gold: false },
      { label: "Loyalty Award", icon: Heart, gold: false },
    ],
  },
  {
    year: "2016 - 2020",
    degree: "Junior High School",
    school: "Marian College of Baliuag, Inc",
    description: "",
    badge: "With Honors",
    badgeIcon: Trophy,
    awards: [
      { label: "With Honors (Average: 90.2)", icon: Trophy, gold: true },
      { label: "Best in English", icon: BookOpen, gold: false },
      { label: "Best in TLE", icon: Monitor, gold: false },
      { label: "Best in Science", icon: Atom, gold: false },
      { label: "Best in Computer", icon: Monitor, gold: false },
      { label: "Best in A.P.", icon: Globe, gold: false },
    ],
  },
];

const degreeIcons = [GraduationCap, Student, Student];

const filterPills = [
  { label: "College", icon: GraduationCap },
  { label: "Senior High School", icon: ChalkboardTeacher },
  { label: "Junior High School", icon: Backpack },
];

export default function Education() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setActiveFilter(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on("select", onScroll);
    emblaApi.on("reInit", onScroll);
  }, [emblaApi, onScroll]);

  const handleScrollbarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!emblaApi || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const targetSnap = Math.round(clickPosition * (educationData.length - 1));
    emblaApi.scrollTo(targetSnap);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#000000] flex flex-col items-center justify-center px-16 py-20">
      {/* Title */}
      <h2
        className="text-white text-6xl font-light tracking-tight mb-8"
        style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
      >
        Education
      </h2>

      {/* Filter Pills */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {filterPills.map((pill, index) => {
          const PillIcon = pill.icon;
          const isActive = activeFilter === index;
          return (
            <button
              key={pill.label}
              onClick={() => {
                setActiveFilter(index);
                emblaApi?.scrollTo(index);
              }}
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

      {/* Description */}
      <p
        className="text-white/40 text-sm font-mono text-center max-w-2xl mb-12"
      >
        A learning journey from high school to college, developing skills, discipline, and passion for technology and modern digital solutions.
      </p>

      {/* Carousel */}
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex gap-8">
          {educationData.map((item, index) => {
            const DegreeIcon = degreeIcons[index];
            const BadgeIcon = item.badgeIcon;
            const isGold = item.badge === "Magna Cum Laude";
            const hasAwards = item.awards && item.awards.length > 0;

            return (
              <div
                key={index}
                className="flex-[0_0_100%] md:flex-[0_0_48%] lg:flex-[0_0_45%] min-w-0"
              >
                <div
                  className={`border border-white/10 rounded-2xl p-8 transition-all duration-300 relative flex flex-col ${
                    selectedIndex === index
                      ? "bg-white/5 border-white/20"
                      : "bg-transparent"
                  }`}
                  style={{ height: "380px" }}
                >
                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={`absolute top-4 right-4 text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5`}
                      style={
                        isGold
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(234,179,8,0.15) 0%, rgba(245,158,11,0.15) 50%, rgba(234,179,8,0.15) 100%)",
                              border: "1px solid rgba(234,179,8,0.3)",
                            }
                          : undefined
                      }
                    >
                      <BadgeIcon
                        size={12}
                        weight="fill"
                        color={isGold ? "#eab308" : "#ffffff"}
                      />
                      <span
                        style={
                          isGold
                            ? {
                                background:
                                  "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #eab308 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }
                            : undefined
                        }
                      >
                        {item.badge}
                      </span>
                    </span>
                  )}

                  {/* Year + Icon */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-white/40 text-sm font-mono tracking-wider uppercase">
                      {item.year}
                    </span>
                    <DegreeIcon size={18} weight="duotone" color="#ffffff66" />
                  </div>

                  <h3
                    className="text-white text-2xl font-light mb-2"
                    style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                  >
                    {item.degree}
                  </h3>
                  <p
                    className="text-white/60 text-base font-light mb-4"
                    style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                  >
                    {item.school}
                  </p>

                  {/* Awards Section */}
                  {hasAwards && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p
                        className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-3"
                      >
                        Awards & Achievements
                      </p>
                      <div className="overflow-y-auto max-h-[140px] pr-2 custom-scrollbar">
                        {item.awards.map((award, i) => {
                          const AwardIcon = award.icon;
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-2.5 py-1.5"
                            >
                              <AwardIcon
                                size={14}
                                weight="fill"
                                color={award.gold ? "#eab308" : "#ffffff44"}
                              />
                              <span
                                className="text-xs font-mono"
                                style={{
                                  color: award.gold ? "#eab308" : "rgba(255,255,255,0.5)",
                                }}
                              >
                                {award.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Scrollbar */}
      <div className="w-full mt-12 px-16">
        <div
          ref={trackRef}
          onClick={handleScrollbarClick}
          className="relative h-1 bg-white/10 rounded-full cursor-pointer group"
        >
          <div
            className="absolute top-0 left-0 h-full bg-white/60 rounded-full transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ left: `calc(${scrollProgress}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between mt-4">
          {educationData.map((item, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`text-xs font-mono tracking-wider transition-colors duration-200 ${
                selectedIndex === index
                  ? "text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {item.year.split(" - ")[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </section>
  );
}
