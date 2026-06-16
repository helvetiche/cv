"use client";

import { useScrollMotionBlur } from "@/hooks/useScrollMotionBlur";

export function MotionBlurProvider({ children }: { children: React.ReactNode }) {
  const blurRef = useScrollMotionBlur<HTMLDivElement>();

  return (
    <div ref={blurRef} className="flex flex-col flex-1">
      {children}
    </div>
  );
}
