"use client";

import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaGoogle,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";

const socialLinks = [
  {
    icon: FaGoogle,
    label: "Email",
    value: "naschedelponso7@gmail.com",
    href: "mailto:naschedelponso7@gmail.com",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/nasche-del-ponso",
    href: "https://www.linkedin.com/in/nasche-del-ponso-040b3b277/",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    value: "github.com/helvetiche",
    href: "https://github.com/helvetiche",
  },
  {
    icon: FaFacebook,
    label: "Facebook",
    value: "facebook.com/nasche.del.ponso",
    href: "https://www.facebook.com/nasche.del.ponso",
  },
];

export default function Contact() {
  return (
    <section className="relative w-full bg-[#000000] py-12 md:py-16 lg:py-24 overflow-hidden">
      {/* Grid Background */}
      <GridBackground />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2
            className="text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4 md:mb-6"
            style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
          >
            Let&apos;s Connect
          </h2>
          <p className="text-white/30 text-xs md:text-sm font-mono max-w-lg mx-auto leading-relaxed px-2">
            Interested in working together or have a question? Feel free to reach out through any of the channels below.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12">
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
                  <div className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] shrink-0">
                      <Icon size={16} className="text-white/60 md:w-[18px] md:h-[18px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/30 text-[9px] md:text-[10px] font-mono uppercase tracking-widest mb-0.5 md:mb-1">
                        {link.label}
                      </p>
                      <p className="text-white/70 text-xs md:text-sm font-mono truncate">
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
          <div className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] shrink-0">
              <FaMapMarkerAlt size={16} className="text-white/60 md:w-[18px] md:h-[18px]" />
            </div>
            <div className="flex-1">
              <p className="text-white/30 text-[9px] md:text-[10px] font-mono uppercase tracking-widest mb-0.5 md:mb-1">
                Location
              </p>
              <p className="text-white/70 text-xs md:text-sm font-mono">
                Baliuag, Bulacan, Philippines
              </p>
            </div>
          </div>
        </BorderGlow>

        {/* CTA */}
        <div className="text-center mt-8 md:mt-12">
          <a
            href="mailto:naschedelponso7@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06]"
          >
            <FaPaperPlane size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-xs md:text-sm font-mono tracking-wide uppercase">
              Send Me a Message
            </span>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-8 md:mt-12 lg:mt-16 w-px h-12 md:h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
