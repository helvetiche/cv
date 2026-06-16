"use client";

import PixelBlast from './PixelBlast';
import Fade from './Fade';
import Name from './Name';
import Banner from './Banner';
import RightContent from './RightContent';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Fixed Background Layer */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <PixelBlast
          className='absolute inset-0'
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

      {/* Mobile overlay to reduce background opacity */}
      <div className="absolute inset-0 z-[4] bg-black/80 md:bg-transparent pointer-events-none" />

      <Fade />
      <Banner />
      
      {/* Content Container - stacks on mobile, side-by-side on desktop */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-end md:justify-between min-h-[calc(100vh-60px)] md:min-h-screen px-4 md:px-8 pt-20 md:pt-0 pb-8 md:pb-8 gap-8 md:gap-0">
        <Name />
        <RightContent />
      </div>
    </section>
  );
}
