"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaHome,
  FaUserGraduate,
  FaBriefcase,
  FaFolderOpen,
  FaEnvelope,
  FaList,
  FaTimes,
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BorderGlow from "./BorderGlow";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

/* ============================================
   NAV ITEMS — id matches section IDs in page.tsx
   ============================================ */
const navItems = [
  { id: "home", label: "Home", icon: FaHome },
  { id: "education", label: "Education", icon: FaUserGraduate },
  { id: "experience", label: "Experience", icon: FaBriefcase },
  { id: "projects", label: "Projects", icon: FaFolderOpen },
  { id: "contact", label: "Contact", icon: FaEnvelope },
] as const;

type SectionId = (typeof navItems)[number]["id"];

/* ============================================
   TYPEWRITER CONFIG
   ============================================ */
const NAME = "Nasche Del Ponso";
const TAGLINE = "Open For Work";
const TYPING_SPEED = 80;
const DELETION_SPEED = 50;
const PAUSE_DURATION = 2000;

/* ============================================
   BANNER OFFSET for scroll-to-section
   ============================================ */
const BANNER_OFFSET = 80;

/* ============================================
   SUB-COMPONENT: Active indicator pill
   Renders a small dot underneath the active nav item
   ============================================ */
function ActiveIndicator({ activeId }: { activeId: string }) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!indicatorRef.current || !containerRef.current) return;

    const activeBtn = containerRef.current.querySelector(
      `[data-nav-id="${activeId}"]`
    ) as HTMLElement | null;

    if (!activeBtn) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    gsap.to(indicatorRef.current, {
      x: btnRect.left - containerRect.left + btnRect.width / 2 - 2,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [activeId]);

  return (
    <div
      ref={indicatorRef}
      className="absolute bottom-0 w-1 h-1 rounded-full bg-white opacity-0"
    />
  );
}

/* ============================================
   MAIN COMPONENT: Banner
   ============================================ */
export default function Banner() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<
    | "typing-name"
    | "pausing-name"
    | "deleting-name"
    | "typing-tagline"
    | "pausing-tagline"
    | "deleting-tagline"
  >("typing-name");
  const [showCursor, setShowCursor] = useState(true);

  const navRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  /* ------------------------------------------
     BLINKING CURSOR
     ------------------------------------------ */
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  /* ------------------------------------------
     TYPEWRITER EFFECT (loops forever)
     ------------------------------------------ */
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "typing-name":
        if (displayText.length < NAME.length) {
          timeout = setTimeout(
            () => setDisplayText(NAME.slice(0, displayText.length + 1)),
            TYPING_SPEED
          );
        } else {
          timeout = setTimeout(() => setPhase("pausing-name"), PAUSE_DURATION);
        }
        break;

      case "pausing-name":
        timeout = setTimeout(() => setPhase("deleting-name"), 500);
        break;

      case "deleting-name":
        if (displayText.length > 0) {
          timeout = setTimeout(
            () => setDisplayText(displayText.slice(0, -1)),
            DELETION_SPEED
          );
        } else {
          timeout = setTimeout(() => setPhase("typing-tagline"), 300);
        }
        break;

      case "typing-tagline":
        if (displayText.length < TAGLINE.length) {
          timeout = setTimeout(
            () => setDisplayText(TAGLINE.slice(0, displayText.length + 1)),
            TYPING_SPEED
          );
        } else {
          timeout = setTimeout(() => setPhase("pausing-tagline"), PAUSE_DURATION);
        }
        break;

      case "pausing-tagline":
        timeout = setTimeout(() => setPhase("deleting-tagline"), 500);
        break;

      case "deleting-tagline":
        if (displayText.length > 0) {
          timeout = setTimeout(
            () => setDisplayText(displayText.slice(0, -1)),
            DELETION_SPEED
          );
        } else {
          timeout = setTimeout(() => setPhase("typing-name"), 300);
        }
        break;
    }

    return () => clearTimeout(timeout);
  }, [phase, displayText]);

  /* ------------------------------------------
     SCROLL-TRIGGER: Track active section
     ------------------------------------------ */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const timer = setTimeout(() => {
      navItems.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top 30%",
          end: "bottom 30%",
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        });
      });

      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      initializedRef.current = false;
    };
  }, []);

  /* ------------------------------------------
     GSAP SCROLL TO SECTION
     ------------------------------------------ */
  const scrollToSection = useCallback((id: SectionId) => {
    const target = document.getElementById(id);
    if (!target) return;

    gsap.to(window, {
      duration: 0.25,
      ease: "power1.out",
      scrollTo: {
        y: target,
        offsetY: BANNER_OFFSET,
      },
    });
  }, []);

  /* ------------------------------------------
     HANDLE NAV CLICK (desktop + mobile)
     ------------------------------------------ */
  const handleNavClick = useCallback(
    (id: SectionId) => {
      scrollToSection(id);
      setMenuOpen(false);
    },
    [scrollToSection]
  );

  /* ------------------------------------------
     MOBILE MENU: Animate open/close with GSAP
     ------------------------------------------ */
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (menuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [menuOpen]);

  return (
    <div className="fixed top-2 inset-x-2 md:top-6 md:left-1/2 md:-translate-x-1/2 z-50">
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#120F17"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        coneSpread={25}
        animated={false}
        colors={["#c084fc", "#f472b6", "#38bdf8"]}
        className="w-full md:w-auto"
      >
        <div
          style={{
            padding: "0.5em 0.75em",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="md:px-6 md:py-2.5"
        >
          {/* Left: Name with typewriter effect */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 flex-shrink-0 min-w-[200px] md:min-w-[260px] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <FaBriefcase size={14} className="text-white shrink-0" />
            <span className="text-white text-sm md:text-base font-mono tracking-tight">
              {displayText}
              <span
                className={`inline-block w-[2px] h-[1em] bg-white/70 ml-0.5 align-middle transition-opacity duration-100 ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              />
            </span>
          </button>

          {/* Desktop nav — md and up */}
          <div
            ref={navRef}
            className="hidden md:flex items-center gap-5 lg:gap-8 relative"
          >
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  data-nav-id={id}
                  onClick={() => handleNavClick(id)}
                  className={`flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "text-white opacity-100"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <Icon
                    size={14}
                    color={isActive ? "#ffffff" : "rgba(255,255,255,0.4)"}
                  />
                  <span
                    className={`text-xs lg:text-sm font-mono tracking-wide uppercase transition-all duration-300 ${
                      isActive ? "text-white" : "text-white/40"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
            {/* Active indicator dot */}
            <ActiveIndicator activeId={activeSection} />
          </div>

          {/* Mobile menu button — right side */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 hover:opacity-80 transition-opacity ml-auto"
          >
            {menuOpen ? (
              <FaTimes size={20} />
            ) : (
              <FaList size={20} />
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-white/10 px-4 pb-3 pt-2 space-y-1 overflow-hidden"
          >
            {navItems.map(({ id, label, icon: Icon }, index) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`flex items-center gap-2 w-full cursor-pointer px-3 py-2.5 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:bg-white/5 hover:text-white/70"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <Icon
                    size={14}
                    color={isActive ? "#ffffff" : "rgba(255,255,255,0.4)"}
                  />
                  <span className="text-xs font-mono tracking-wide uppercase">
                    {label}
                  </span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </BorderGlow>
    </div>
  );
}
