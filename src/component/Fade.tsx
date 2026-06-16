export default function Fade() {
  return (
    <>
      {/* Mobile fade - taller */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[6] pointer-events-none md:hidden"
        style={{
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)',
        }}
      />
      {/* Desktop fade - shorter */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[6] pointer-events-none hidden md:block"
        style={{
          height: '25%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
        }}
      />
    </>
  );
}
