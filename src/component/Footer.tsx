"use client";

import {
  ArrowUp,
  LinkedinLogo,
  GithubLogo,
  FacebookLogo,
  Envelope,
  Student,
} from "@phosphor-icons/react";

const socialLinks = [
  { icon: LinkedinLogo, label: "LinkedIn", href: "#" },
  { icon: GithubLogo, label: "GitHub", href: "#" },
  { icon: FacebookLogo, label: "Facebook", href: "#" },
  { icon: Envelope, label: "Email", href: "mailto:nasche.delponso@email.com" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#000000] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-20 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo/Name */}
          <div className="flex items-center gap-3">
            <Student size={20} weight="fill" color="rgba(255,255,255,0.5)" />
            <span
              className="text-white/50 text-base font-light"
              style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
            >
              Nasche Del Ponso
            </span>
          </div>

          {/* Center: Copyright */}
          <p className="text-white/25 text-xs font-mono tracking-wide">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>

          {/* Right: Social Links + Back to Top */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/70 transition-colors duration-200"
              >
                <Icon size={18} weight="fill" />
              </a>
            ))}

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/30 hover:text-white/70 hover:border-white/20 transition-all duration-200 ml-2"
              aria-label="Back to top"
            >
              <ArrowUp size={14} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
