"use client";

import PixelBlast from './PixelBlast';
import Fade from './Fade';
import Name from './Name';
import Banner from './Banner';
import RightContent from './RightContent';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <PixelBlast
        className=''
          variant="square"
          pixelSize={4}
          color="#c4c4c4"
          patternScale={4.25}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>
      <div className="relative z-10 w-full h-full" />

      <Fade />
      <Banner />
      
      {/* Content Container - stacks on mobile, side-by-side on desktop */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-end md:justify-between min-h-screen px-4 md:px-8 pb-8 md:pb-8">
        <Name />
        <RightContent />
      </div>
    </section>
  );
}
