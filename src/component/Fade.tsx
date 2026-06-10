export default function Fade() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
      style={{
        height: '50%',
        background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
      }}
    />
  );
}
