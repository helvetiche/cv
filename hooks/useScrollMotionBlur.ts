"use client";

import { useEffect, useRef, useCallback } from "react";

/* ============================================
   CONFIG
   ============================================ */
const MAX_BLUR = 6; // maximum blur in pixels
const DECAY = 0.88; // how fast blur decays when scrolling stops (0-1, higher = slower)
const SENSITIVITY = 0.15; // how much scroll velocity translates to blur
const MIN_VELOCITY = 0.5; // minimum velocity to register (filters out jitter)
const DIRECTIONAL = true; // true = directional blur, false = uniform blur

/* ============================================
   SVG FILTER CREATION
   Creates an SVG filter element with feGaussianBlur
   that can be directionally controlled
   ============================================ */
function createMotionBlurSvg(): {
  element: SVGSVGElement;
  feBlur: SVGFEGaussianBlurElement;
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

  return { element: svg, feBlur, setBlur };
}

/* ============================================
   HOOK: useScrollMotionBlur
   Applies a directional motion blur to a target
   element based on scroll velocity
   ============================================ */
export function useScrollMotionBlur<T extends HTMLElement = HTMLDivElement>() {
  const targetRef = useRef<T>(null);
  const svgRef = useRef<ReturnType<typeof createMotionBlurSvg> | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastScrollRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ------------------------------------------
     Apply the SVG filter to the target element
     ------------------------------------------ */
  const applyFilter = useCallback(() => {
    if (!targetRef.current || !svgRef.current) return;
    targetRef.current.style.filter = "url(#scroll-motion-blur)";
  }, []);

  /* ------------------------------------------
     Animation loop: decay blur over time
     ------------------------------------------ */
  const animate = useCallback(() => {
    if (!svgRef.current) return;

    const { x, y } = velocityRef.current;

    // Decay velocity
    velocityRef.current.x *= DECAY;
    velocityRef.current.y *= DECAY;

    // Clamp to zero when very small
    if (Math.abs(velocityRef.current.x) < 0.01) velocityRef.current.x = 0;
    if (Math.abs(velocityRef.current.y) < 0.01) velocityRef.current.y = 0;

    // Calculate blur amounts
    const blurX = DIRECTIONAL
      ? Math.min(Math.abs(velocityRef.current.x) * SENSITIVITY, MAX_BLUR)
      : Math.min(
          Math.sqrt(
            velocityRef.current.x ** 2 + velocityRef.current.y ** 2
          ) *
            SENSITIVITY,
          MAX_BLUR
        );
    const blurY = DIRECTIONAL
      ? Math.min(Math.abs(velocityRef.current.y) * SENSITIVITY, MAX_BLUR)
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
  }, []);

  /* ------------------------------------------
     Scroll handler: track velocity
     ------------------------------------------ */
  const handleScroll = useCallback(() => {
    const currentX = window.scrollX;
    const currentY = window.scrollY;

    const deltaX = Math.abs(currentX - lastScrollRef.current.x);
    const deltaY = Math.abs(currentY - lastScrollRef.current.y);

    lastScrollRef.current = { x: currentX, y: currentY };

    // Only register if above minimum velocity threshold
    if (deltaX > MIN_VELOCITY || deltaY > MIN_VELOCITY) {
      velocityRef.current.x = deltaX;
      velocityRef.current.y = deltaY;

      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    // Reset scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (!isScrollingRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }, 50);
  }, [animate]);

  /* ------------------------------------------
     Setup: create SVG filter, attach listeners
     ------------------------------------------ */
  useEffect(() => {
    svgRef.current = createMotionBlurSvg();
    applyFilter();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Remove SVG element
      if (svgRef.current) {
        svgRef.current.element.remove();
        svgRef.current = null;
      }
      // Remove filter from target
      if (targetRef.current) {
        targetRef.current.style.filter = "";
      }
    };
  }, [handleScroll, applyFilter]);

  return targetRef;
}
