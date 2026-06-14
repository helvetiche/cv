import Pills from './Pills';

export default function Name() {
  return (
    <div className="relative z-30 max-w-full md:max-w-[50%] pt-24 md:pt-0">
      <h1
        className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight"
        style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
      >
        Nasche Del Ponso
      </h1>
      <Pills />
      <p
        className="text-white/70 text-sm md:text-base font-light leading-relaxed mt-4 md:mt-6 text-justify font-mono"
      >
        Junior Modern Technology Generalist specializing in integration, cloud computing, and artificial intelligence. I build scalable solutions that streamline processes and drive innovation across digital systems.
      </p>
    </div>
  );
}
