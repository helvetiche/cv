import { LinkedinLogo, GithubLogo, FacebookLogo, Envelope, DownloadSimple } from '@phosphor-icons/react';
import BorderGlow from './BorderGlow';

const socials = [
  { icon: LinkedinLogo, label: 'LinkedIn', href: '#' },
  { icon: GithubLogo, label: 'GitHub', href: '#' },
  { icon: FacebookLogo, label: 'Facebook', href: '#' },
  { icon: Envelope, label: 'Email', href: '#' },
];

export default function RightContent() {
  return (
    <div className="relative z-30 max-w-full md:max-w-[40%] text-center md:text-right mt-6 md:mt-0">
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
            <Icon size={20} weight="fill" className="md:w-6 md:h-6" />
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
              href="#"
              style={{ padding: '0.4em 1em', display: 'flex', alignItems: 'center', gap: '0.5em' }}
              className="md:px-6 md:py-2"
            >
              <DownloadSimple size={14} weight="fill" color="#ffffff" className="md:w-4 md:h-4" />
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
