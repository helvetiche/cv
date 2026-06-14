"use client";

import { useState } from 'react';
import { Briefcase, House, Student, Briefcase as BriefcaseIcon, FolderOpen, Envelope, List } from '@phosphor-icons/react';
import BorderGlow from './BorderGlow';

const navItems = [
  { label: 'Home', icon: House },
  { label: 'Education', icon: Student },
  { label: 'Experience', icon: BriefcaseIcon },
  { label: 'Projects', icon: FolderOpen },
  { label: 'Contact', icon: Envelope },
];

export default function Banner() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-2 inset-x-2 md:top-6 md:inset-x-auto md:w-auto z-50 flex justify-end md:justify-center overflow-hidden">
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
        className="w-full md:w-auto"
      >
        <div style={{ padding: '0.5em 0.75em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="md:px-6 md:py-3">
          {/* Left: Open For Work badge - hidden on small mobile */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Briefcase size={14} weight="fill" color="#ffffff" />
            <span className="text-white text-xs md:text-sm font-mono tracking-wide uppercase">
              Open For Work
            </span>
          </div>

          {/* Desktop nav - md and up */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
            {navItems.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Icon size={14} weight="fill" color="#ffffff" />
                <span className="text-white text-xs lg:text-sm font-mono tracking-wide uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 hover:opacity-80 transition-opacity"
          >
            <List size={20} weight="bold" />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 pb-3 pt-2 space-y-1">
            <div className="flex items-center gap-2 px-3 py-1 text-white/50 text-xs font-mono uppercase">
              <Briefcase size={12} weight="fill" />
              Open For Work
            </div>
            {navItems.map(({ label, icon: Icon }) => (
              <div
                key={label}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Icon size={14} weight="fill" color="#ffffff" />
                <span className="text-white text-xs font-mono tracking-wide uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </BorderGlow>
    </div>
  );
}
