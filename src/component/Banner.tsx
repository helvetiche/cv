import { Briefcase, House, Student, Briefcase as BriefcaseIcon, FolderOpen, Envelope } from '@phosphor-icons/react';
import BorderGlow from './BorderGlow';

const navItems = [
  { label: 'Home', icon: House },
  { label: 'Education', icon: Student },
  { label: 'Experience', icon: BriefcaseIcon },
  { label: 'Projects', icon: FolderOpen },
  { label: 'Contact Me', icon: Envelope },
];

export default function Banner() {
  return (
    <div className="fixed top-6 left-6 right-6 z-50">
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
        <div style={{ padding: '0.75em 2em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            <Briefcase size={16} weight="fill" color="#ffffff" />
            <span className="text-white text-sm font-mono tracking-wide uppercase">
              Open For Work
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5em' }}>
            {navItems.map(({ label, icon: Icon }) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4em', cursor: 'pointer' }}
                className="hover:opacity-80 transition-opacity"
              >
                <Icon size={16} weight="fill" color="#ffffff" />
                <span className="text-white text-sm font-mono tracking-wide uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </BorderGlow>
    </div>
  );
}
