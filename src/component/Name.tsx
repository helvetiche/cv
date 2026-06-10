import Pills from './Pills';

export default function Name() {
  return (
    <div className="absolute bottom-8 left-8 z-30 max-w-[50%]">
      <h1
        className="text-white text-8xl font-light tracking-tight"
        style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
      >
        Nasche Del Ponso
      </h1>
      <Pills />
      <p
        className="text-white/70 text-m font-light leading-relaxed mt-6 text-justify font-mono"
      >
        Junior Modern Technology Generalist specializing in integration, cloud computing, and artificial intelligence. I build scalable solutions that streamline processes and drive innovation across digital systems.
      </p>
    </div>
  );
}
