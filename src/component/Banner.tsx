import { Briefcase, House, Student, Briefcase as BriefcaseIcon, FolderOpen, Envelope } from '@phosphor-icons/react';
import BorderGlow from './BorderGlow';

const navItems = [
  { label: 'Home', icon: House, shortLabel: 'Home' },
  { label: 'Education', icon: Student, shortLabel: 'Edu' },
  { label: 'Experience', icon: BriefcaseIcon, shortLabel: 'Exp' },
  { label: 'Projects', icon: FolderOpen, shortLabel: 'Projects' },
  { label: 'Contact Me', icon: Envelope, shortLabel: 'Contact' },
];

export default function Banner() {
  return (
    <div className="fixed top-2 left-2 right-2 md:top-6 md:left-6 md:right-6 z-50">
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
        <div style={{ padding: '0.5em 1em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="md:px-8 md:py-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            <Briefcase size={14} weight="fill" color="#ffffff" className="md:w-4 md:h-4" />
            <span className="text-white text-xs md:text-sm font-mono tracking-wide uppercase">
              Open For Work
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }} className="md:gap-10">
            {navItems.map(({ label, icon: Icon, shortLabel }) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3em', cursor: 'pointer' }}
                className="hover:opacity-80 transition-opacity"
              >
                <Icon size={14} weight="fill" color="#ffffff" className="md:w-4 md:h-4" />
                <span className="text-white text-xs md:text-sm font-mono tracking-wide uppercase hidden sm:inline">
                  {label}
                </span>
                <span className="text-white text-xs font-mono tracking-wide uppercase sm:hidden">
                  {shortLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </BorderGlow>
    </div>
  );
}
