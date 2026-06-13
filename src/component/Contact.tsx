"use client";

import {
  Envelope,
  LinkedinLogo,
  GithubLogo,
  FacebookLogo,
  MapPin,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";

const socialLinks = [
  {
    icon: Envelope,
    label: "Email",
    value: "nasche.delponso@email.com",
    href: "mailto:nasche.delponso@email.com",
  },
  {
    icon: LinkedinLogo,
    label: "LinkedIn",
    value: "linkedin.com/in/naschedelponso",
    href: "#",
  },
  {
    icon: GithubLogo,
    label: "GitHub",
    value: "github.com/naschedelponso",
    href: "#",
  },
  {
    icon: FacebookLogo,
    label: "Facebook",
    value: "facebook.com/naschedelponso",
    href: "#",
  },
];

export default function Contact() {
  return (
    <section className="relative w-full bg-[#000000] py-24 overflow-hidden">
      {/* Grid Background */}
      <GridBackground />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-white text-5xl font-light tracking-tight mb-6"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            Let's Connect
          </h2>
          <p className="text-white/30 text-sm font-mono max-w-lg mx-auto leading-relaxed">
            Interested in working together or have a question? Feel free to reach out through any of the channels below.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BorderGlow
                  edgeSensitivity={25}
                  glowColor="0 0 100"
                  backgroundColor="#080808"
                  borderRadius={12}
                  glowRadius={18}
                  glowIntensity={0.25}
                  coneSpread={20}
                  animated={false}
                  colors={["#ffffff", "#ffffff", "#ffffff"]}
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] shrink-0">
                      <Icon size={18} weight="fill" color="rgba(255,255,255,0.6)" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-1">
                        {link.label}
                      </p>
                      <p className="text-white/70 text-sm font-mono truncate">
                        {link.value}
                      </p>
                    </div>
                  </div>
                </BorderGlow>
              </a>
            );
          })}
        </div>

        {/* Location Card */}
        <BorderGlow
          edgeSensitivity={25}
          glowColor="0 0 100"
          backgroundColor="#080808"
          borderRadius={12}
          glowRadius={18}
          glowIntensity={0.25}
          coneSpread={20}
          animated={false}
          colors={["#ffffff", "#ffffff", "#ffffff"]}
        >
          <div className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] shrink-0">
              <MapPin size={18} weight="fill" color="rgba(255,255,255,0.6)" />
            </div>
            <div className="flex-1">
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-1">
                Location
              </p>
              <p className="text-white/70 text-sm font-mono">
                Baliuag, Bulacan, Philippines
              </p>
            </div>
          </div>
        </BorderGlow>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="mailto:nasche.delponso@email.com"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06]"
          >
            <PaperPlaneTilt size={18} weight="fill" />
            <span className="text-sm font-mono tracking-wide uppercase">
              Send Me a Message
            </span>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-16 w-px h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
