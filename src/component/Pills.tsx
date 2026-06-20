import { FaCode, FaPaintBrush, FaMagic } from 'react-icons/fa';
import BorderGlow from './BorderGlow';

const pills = [
  { label: 'DEVELOPER', icon: FaCode },
  { label: 'DESIGNER', icon: FaPaintBrush },
  { label: 'CREATOR', icon: FaMagic },
];

export default function Pills() {
  return (
    <div className="flex flex-nowrap gap-2 md:gap-4 mt-4 md:mt-6">
      {pills.map(({ label, icon: Icon }) => (
        <BorderGlow
          key={label}
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
          <div style={{ padding: '0.4em 1em', display: 'flex', alignItems: 'center', gap: '0.5em' }} className="md:px-6 md:py-2">
            <Icon size={14} className="text-white" />
            <span
              className="text-white text-xs md:text-sm font-mono tracking-wide uppercase"
            >
              {label}
            </span>
          </div>
        </BorderGlow>
      ))}
    </div>
  );
}
