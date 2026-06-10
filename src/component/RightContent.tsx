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
    <div className="absolute bottom-8 right-8 z-30 max-w-[40%] text-right">
      <p
        className="text-white/70 text-lg font-light leading-relaxed"
        style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
      >
        Open for Work — Ready to contribute through AI, cloud computing, system integration, and scalable digital solutions with real impact.
      </p>
      <div className="flex items-center justify-end gap-4 mt-6">
        {socials.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Icon size={24} weight="fill" />
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
              style={{ padding: '0.5em 1.5em', display: 'flex', alignItems: 'center', gap: '0.5em' }}
            >
              <DownloadSimple size={16} weight="fill" color="#ffffff" />
              <span className="text-white text-sm font-mono tracking-wide uppercase">
                Download Resume
              </span>
            </a>
          </BorderGlow>
          <span className="absolute -top-2 -right-2 bg-red-500/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
            Open for Work
          </span>
        </div>
      </div>
    </div>
  );
}
