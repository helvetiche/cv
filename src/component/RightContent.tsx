import Image from 'next/image';
import { FaLinkedin, FaGithub, FaFacebook, FaGoogle, FaDownload } from 'react-icons/fa';
import BorderGlow from './BorderGlow';

const socials = [
  { icon: FaLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/nasche-del-ponso-040b3b277/' },
  { icon: FaGithub, label: 'GitHub', href: 'https://github.com/helvetiche' },
  { icon: FaFacebook, label: 'Facebook', href: 'https://www.facebook.com/nasche.del.ponso' },
  { icon: FaGoogle, label: 'Email', href: 'mailto:naschedelponso7@gmail.com' },
];

export default function RightContent() {
  return (
    <div className="relative z-30 max-w-full md:max-w-[40%] text-center md:text-right mt-6 md:mt-0">
      {/* Profile Image with Border Glow */}
      <div className="flex justify-center md:justify-end mb-6">
        <BorderGlow
          edgeSensitivity={30}
          glowColor="0 0 100"
          backgroundColor="transparent"
          borderRadius={9999}
          glowRadius={20}
          glowIntensity={0.5}
          coneSpread={25}
          animated={false}
          colors={["#ffffff", "#ffffff", "#ffffff"]}
        >
          <div className="relative w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden">
            <Image
              src="/me.png"
              alt="Nasche Del Ponso"
              fill
              className="object-cover"
              priority
            />
          </div>
        </BorderGlow>
      </div>

      <p
        className="text-white/90 md:text-white/70 text-sm md:text-lg font-light leading-relaxed"
        style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
      >
        Open for Work — Ready to contribute through AI, cloud computing, system integration, and scalable digital solutions with real impact.
      </p>
      <div className="flex items-center justify-center md:justify-end gap-3 md:gap-4 mt-4 md:mt-6">
        {socials.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <Icon size={20} className="md:w-6 md:h-6" />
          </a>
        ))}
        <div className="relative inline-flex">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#120F17"
            borderRadius={28}
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
          >
            <a
              href="https://docs.google.com/document/d/1t3VHEhvuVTXtDvqVjI3HSQo05W2aScH6W8RwJpBC6rw/edit?tab=t.0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0.4em 1em', display: 'flex', alignItems: 'center', gap: '0.5em' }}
              className="md:px-6 md:py-2"
            >
              <FaDownload size={14} className="text-white md:w-4 md:h-4" />
              <span className="text-white text-xs md:text-sm font-mono tracking-wide uppercase">
                Resume
              </span>
            </a>
          </BorderGlow>
          <span className="absolute -top-2 -right-2 bg-red-500/80 text-white text-[9px] md:text-[10px] font-mono px-1.5 py-0.5 md:px-2 rounded-full">
            Open for Work
          </span>
        </div>
      </div>
    </div>
  );
}
