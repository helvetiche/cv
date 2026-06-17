"use client";

import { useEffect, useRef } from "react";

/* ============================================
   CONFIG
   ============================================ */
const MAX_BLUR = 6;
const DECAY = 0.88;
const SENSITIVITY = 0.15;
const MIN_VELOCITY = 0.5;
const DIRECTIONAL = true;

/* ============================================
   SVG FILTER CREATION
   ============================================ */
function createMotionBlurSvg(): {
  element: SVGSVGElement;
  setBlur: (x: number, y: number) => void;
} {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.width = "0";
  svg.style.height = "0";
  svg.style.overflow = "hidden";
  svg.style.pointerEvents = "none";

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id", "scroll-motion-blur");
  filter.setAttribute("x", "-50%");
  filter.setAttribute("y", "-50%");
  filter.setAttribute("width", "200%");
  filter.setAttribute("height", "200%");

  const feBlur = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feGaussianBlur"
  );
  feBlur.setAttribute("in", "SourceGraphic");
  feBlur.setAttribute("stdDeviation", "0 0");

  filter.appendChild(feBlur);
  defs.appendChild(filter);
  svg.appendChild(defs);
  document.body.appendChild(svg);

  const setBlur = (x: number, y: number) => {
    feBlur.setAttribute("stdDeviation", `${x} ${y}`);
  };

  return { element: svg, setBlur };
}

/* ============================================
   HOOK: useScrollMotionBlur
   ============================================ */
export function useScrollMotionBlur<T extends HTMLElement = HTMLDivElement>() {
  const targetRef = useRef<T>(null);
  const svgRef = useRef<ReturnType<typeof createMotionBlurSvg> | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastScrollRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    svgRef.current = createMotionBlurSvg();

    if (targetRef.current && svgRef.current) {
      targetRef.current.style.filter = "url(#scroll-motion-blur)";
    }

    /* ------------------------------------------
       Animation loop: decay blur over time
       ------------------------------------------ */
    const animate = () => {
      if (!svgRef.current) return;

      // Decay velocity
      velocityRef.current.x *= DECAY;
      velocityRef.current.y *= DECAY;

      // Clamp to zero when very small
      if (Math.abs(velocityRef.current.x) < 0.01) velocityRef.current.x = 0;
      if (Math.abs(velocityRef.current.y) < 0.01) velocityRef.current.y = 0;

      // Calculate blur amounts
      const velX = velocityRef.current.x;
      const velY = velocityRef.current.y;

      const blurX = DIRECTIONAL
        ? Math.min(Math.abs(velX) * SENSITIVITY, MAX_BLUR)
        : Math.min(
            Math.sqrt(velX ** 2 + velY ** 2) * SENSITIVITY,
            MAX_BLUR
          );
      const blurY = DIRECTIONAL
        ? Math.min(Math.abs(velY) * SENSITIVITY, MAX_BLUR)
        : blurX;

      svgRef.current.setBlur(blurX, blurY);

      // Continue animating if there's still velocity
      if (
        Math.abs(velocityRef.current.x) > 0.01 ||
        Math.abs(velocityRef.current.y) > 0.01
      ) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isScrollingRef.current = false;
      }
    };

    /* ------------------------------------------
       Scroll handler: track velocity
       ------------------------------------------ */
    const handleScroll = () => {
      const currentX = window.scrollX;
      const currentY = window.scrollY;

      const deltaX = Math.abs(currentX - lastScrollRef.current.x);
      const deltaY = Math.abs(currentY - lastScrollRef.current.y);

      lastScrollRef.current = { x: currentX, y: currentY };

      if (deltaX > MIN_VELOCITY || deltaY > MIN_VELOCITY) {
        velocityRef.current.x = deltaX;
        velocityRef.current.y = deltaY;

        if (!isScrollingRef.current) {
          isScrollingRef.current = true;
          rafRef.current = requestAnimationFrame(animate);
        }
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isScrollingRef.current) {
          rafRef.current = requestAnimationFrame(animate);
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (svgRef.current) {
        svgRef.current.element.remove();
        svgRef.current = null;
      }
      if (targetRef.current) {
        targetRef.current.style.filter = "";
      }
    };
  }, []);

  return targetRef;
}
