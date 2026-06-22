"use client";

import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaGoogle,
  FaArrowUp,
  FaUserGraduate,
} from "react-icons/fa";

const socialLinks = [
  { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/nasche-del-ponso-040b3b277/" },
  { icon: FaGithub, label: "GitHub", href: "https://github.com/helvetiche" },
  { icon: FaFacebook, label: "Facebook", href: "https://www.facebook.com/nasche.del.ponso" },
  { icon: FaGoogle, label: "Email", href: "mailto:naschedelponso7@gmail.com" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#000000] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-8">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          {/* Top Row: Social Links (mobile) / Name + Social (desktop) */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            {/* Left: Logo/Name */}
            <div className="flex items-center gap-2 md:gap-3">
              <FaUserGraduate size={18} className="text-white/50 md:w-5 md:h-5" />
              <span
                className="text-white/50 text-sm md:text-base font-light"
                style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
              >
                Nasche Del Ponso
              </span>
            </div>

            {/* Center: Copyright */}
            <p className="text-white/25 text-[10px] md:text-xs font-mono tracking-wide text-center order-last md:order-none">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>

            {/* Right: Social Links + Back to Top */}
            <div className="flex items-center gap-3 md:gap-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-white/70 transition-colors duration-200 p-1"
                >
                  <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                </a>
              ))}

              {/* Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-white/10 text-white/30 hover:text-white/70 hover:border-white/20 transition-all duration-200 ml-1 md:ml-2"
                aria-label="Back to top"
              >
                <FaArrowUp size={12} className="md:w-3.5 md:h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
