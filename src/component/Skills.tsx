"use client";

import { useState, useEffect } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiFirebase,
  SiRedis,
  SiVercel,
  SiDocker,
  SiGit,
  SiFigma,
  SiLinux,
  SiWebpack,
  SiVite,
  SiGraphql,
  SiExpress,
  SiSupabase,
  SiPrisma,
  SiOpenai,
  SiStripe,
  SiGooglecloud,
  SiSocketdotio,
  SiD3,
  SiChartdotjs,
  SiGnubash,
} from "react-icons/si";
import { FaCloud, FaRobot } from "react-icons/fa";
import { BiCodeAlt, BiChip, BiWifi } from "react-icons/bi";
import { getProjects } from "../lib/projectsService";

/* ── Constant: AI / dev tools that are always shown ── */
const CONSTANT_SKILLS = [
  { name: "ChatGPT", icon: FaRobot },
  { name: "Cursor", icon: BiCodeAlt },
  { name: "Open Router", icon: BiWifi },
  { name: "Kiro Dev", icon: BiChip },
  { name: "Windsurf", icon: FaCloud },
  { name: "Gemini", icon: FaRobot },
  { name: "Claude", icon: FaRobot },
];

/* ── Full icon map for all possible project tags ── */
const ICON_MAP: Record<string, React.ElementType> = {
  "Next.js": SiNextdotjs,
  React: SiReact,
  "React Native": SiReact,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  Tailwind: SiTailwindcss,
  Firebase: SiFirebase,
  "Google Cloud": SiGooglecloud,
  Supabase: SiSupabase,
  Vercel: SiVercel,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  Prisma: SiPrisma,
  OpenAI: SiOpenai,
  Stripe: SiStripe,
  "D3.js": SiD3,
  "Chart.js": SiChartdotjs,
  WebSocket: SiSocketdotio,
  Git: SiGit,
  Python: SiPython,
  PHP: SiPhp,
  GraphQL: SiGraphql,
  AWS: FaCloud,
  Docker: SiDocker,
  Figma: SiFigma,
  Linux: SiLinux,
  Webpack: SiWebpack,
  Vite: SiVite,
  Cron: SiGnubash,
  "Excel JS": BiCodeAlt,
  Automation: BiChip,
};

function getIcon(name: string): React.ElementType {
  return ICON_MAP[name] ?? FaRobot;
}

export default function Skills() {
  const [projectTags, setProjectTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const projects = await getProjects();
        const tagSet = new Set<string>();
        for (const project of projects) {
          for (const tag of project.tags) {
            tagSet.add(tag);
          }
        }
        setProjectTags(Array.from(tagSet));
      } catch (err) {
        console.error("Failed to fetch project tags:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, []);

  /* Merge constant skills + project tags (deduped) */
  const projectSkills = projectTags.map((name) => ({
    name,
    icon: getIcon(name),
  }));

  const allSkills = [...CONSTANT_SKILLS, ...projectSkills];
  const track = [...allSkills, ...allSkills];

  return (
    <section className="relative w-full bg-[#000000] py-12 md:py-16 lg:py-24 overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2
            className="text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4 md:mb-6"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            Skills &amp; Technologies
          </h2>
          <p className="text-white/30 text-xs md:text-sm font-mono max-w-lg mx-auto leading-relaxed px-2">
            Technologies and tools I work with to bring ideas to life.
          </p>
        </div>
      </div>

      {/* ── Marquee carousel ── */}
      <div className="relative w-full overflow-hidden">
        {/* Fade masks on edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 z-10 bg-gradient-to-r from-[#000000] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 z-10 bg-gradient-to-l from-[#000000] to-transparent" />

        {/* Scrolling track */}
        <div className="flex w-max animate-marquee">
          {loading
            ? /* Skeleton while loading */
              Array.from({ length: 12 }, (_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="flex-shrink-0 w-[140px] md:w-[160px] mx-2 md:mx-3"
                >
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 md:p-5">
                    <div className="w-7 h-7 rounded-full bg-white/5 animate-pulse" />
                    <div className="w-16 h-3 rounded bg-white/5 animate-pulse" />
                  </div>
                </div>
              ))
            : track.map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={`${skill.name}-${i}`}
                    className="flex-shrink-0 w-[140px] md:w-[160px] mx-2 md:mx-3"
                  >
                    <div className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 md:p-5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05]">
                      <Icon
                        size={28}
                        className="text-white/40 transition-colors duration-300 group-hover:text-white/70 md:w-8 md:h-8"
                      />
                      <span className="text-white/50 text-[11px] md:text-xs font-mono tracking-wide text-center transition-colors duration-300 group-hover:text-white/80">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-8 md:mt-12 lg:mt-16 w-px h-12 md:h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />

      {/* Keyframes injected once */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
