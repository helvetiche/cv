"use client";

import { useState, useEffect } from 'react';
import { House, Student, Briefcase, Briefcase as BriefcaseIcon, FolderOpen, Envelope, List } from '@phosphor-icons/react';
import BorderGlow from './BorderGlow';

const navItems = [
  { label: 'Home', icon: House },
  { label: 'Education', icon: Student },
  { label: 'Experience', icon: BriefcaseIcon },
  { label: 'Projects', icon: FolderOpen },
  { label: 'Contact', icon: Envelope },
];

const NAME = "Nasche Del Ponso";
const TAGLINE = "Open For Work";
const TYPING_SPEED = 80;
const DELETION_SPEED = 50;
const PAUSE_DURATION = 2000;

export default function Banner() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<'typing-name' | 'pausing-name' | 'deleting-name' | 'typing-tagline' | 'pausing-tagline' | 'deleting-tagline'>('typing-name');
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Typewriter logic (loops forever)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    switch (phase) {
      case 'typing-name':
        if (displayText.length < NAME.length) {
          timeout = setTimeout(() => setDisplayText(NAME.slice(0, displayText.length + 1)), TYPING_SPEED);
        } else {
          timeout = setTimeout(() => setPhase('pausing-name'), PAUSE_DURATION);
        }
        break;

      case 'pausing-name':
        timeout = setTimeout(() => setPhase('deleting-name'), 500);
        break;

      case 'deleting-name':
        if (displayText.length > 0) {
          timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), DELETION_SPEED);
        } else {
          timeout = setTimeout(() => setPhase('typing-tagline'), 300);
        }
        break;

      case 'typing-tagline':
        if (displayText.length < TAGLINE.length) {
          timeout = setTimeout(() => setDisplayText(TAGLINE.slice(0, displayText.length + 1)), TYPING_SPEED);
        } else {
          timeout = setTimeout(() => setPhase('pausing-tagline'), PAUSE_DURATION);
        }
        break;

      case 'pausing-tagline':
        timeout = setTimeout(() => setPhase('deleting-tagline'), 500);
        break;

      case 'deleting-tagline':
        if (displayText.length > 0) {
          timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), DELETION_SPEED);
        } else {
          timeout = setTimeout(() => setPhase('typing-name'), 300);
        }
        break;
    }

    return () => clearTimeout(timeout);
  }, [phase, displayText]);

  return (
    <div className="fixed top-2 inset-x-2 md:top-6 md:left-1/2 md:-translate-x-1/2 z-50">
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
        <div style={{ padding: '0.5em 0.75em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="md:px-6 md:py-2.5">

          {/* Left: Name with typewriter effect */}
          <div className="flex items-center gap-2 flex-shrink-0 min-w-[200px] md:min-w-[260px]">
            <Briefcase size={14} weight="fill" color="#ffffff" className="shrink-0" />
            <span className="text-white text-sm md:text-base font-mono tracking-tight">
              {displayText}
              <span className={`inline-block w-[2px] h-[1em] bg-white/70 ml-0.5 align-middle transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
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

          {/* Mobile menu button - right side */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 hover:opacity-80 transition-opacity ml-auto"
          >
            <List size={20} weight="bold" />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 pb-3 pt-2 space-y-1">
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
