"use client";

export default function GridBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Grid Layer */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "200px 200px",
          backgroundPosition: "center center",
          maskImage: `
            linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)
          `,
          WebkitMaskImage: `
            linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Vignette Layer (z-index above grid) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(
              ellipse 130% 130% at 50% 50%,
              transparent 0%,
              transparent 60%,
              rgba(0, 0, 0, 0.2) 80%,
              rgba(0, 0, 0, 0.5) 100%
            )
          `,
        }}
      />
    </div>
  );
}
