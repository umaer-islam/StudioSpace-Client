"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Aperture } from "lucide-react";

export function CinematicReveal() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const lensFlareRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if user already experienced the cinematic intro in this session
    const hasSeen = sessionStorage.getItem("studiospace_cinematic_revealed");
    if (hasSeen) {
      setVisible(false);
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      sessionStorage.setItem("studiospace_cinematic_revealed", "true");
      setVisible(false);
      return;
    }

    // Prevent scrolling while cinematic shutter opens
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("studiospace_cinematic_revealed", "true");
        setVisible(false);
        document.body.style.overflow = "";
      },
    });

    // 1. Initial State
    tl.set(overlayRef.current, { display: "block" });
    tl.set([topCurtainRef.current, bottomCurtainRef.current], { yPercent: 0 });
    tl.set(lensFlareRef.current, { scaleX: 0, opacity: 0 });

    // 2. Animate Shutter Counter from 0 to 100
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 0.75,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.floor(counterObj.val)).padStart(2, "0");
        }
      },
    });

    // 3. Flare anamorphic light streak across the aperture seam
    tl.to(
      lensFlareRef.current,
      {
        scaleX: 1.4,
        opacity: 0.9,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // 4. Center slate glides forward with camera focus pull
    tl.to(
      centerContentRef.current,
      {
        scale: 1.06,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.4,
        ease: "power3.in",
      },
      "-=0.15"
    );

    // 5. Cinematic Anamorphic Shutter Split (Top up, Bottom down)
    tl.to(
      topCurtainRef.current,
      {
        yPercent: -100,
        duration: 0.85,
        ease: "power4.inOut",
      },
      "-=0.1"
    );

    tl.to(
      bottomCurtainRef.current,
      {
        yPercent: 100,
        duration: 0.85,
        ease: "power4.inOut",
      },
      "<"
    );

    // 6. Dissolve lens flare
    tl.to(
      lensFlareRef.current,
      {
        opacity: 0,
        scaleY: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      "<+=0.2"
    );

    // 7. Fade wrapper
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.15,
        ease: "power1.out",
      },
      "-=0.15"
    );

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999999] pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Top Anamorphic Shutter Curtain */}
      <div
        ref={topCurtainRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-[#0c0c0b] border-b border-white/10 will-change-transform"
      />

      {/* Bottom Anamorphic Shutter Curtain */}
      <div
        ref={bottomCurtainRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0c0c0b] border-t border-white/10 will-change-transform"
      />

      {/* Center Anamorphic Horizon Lens Flare */}
      <div
        ref={lensFlareRef}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#d97745] to-transparent pointer-events-none will-change-transform shadow-[0_0_24px_#d97745]"
      />

      {/* Center Production Slate */}
      <div
        ref={centerContentRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-white will-change-transform"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl">
            <Aperture size={22} className="text-[#d97745] animate-spin-slow" />
          </div>
          <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
            Studio<span className="text-[#d97745]">Space</span>.
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs tracking-[0.25em] uppercase text-stone-400 font-mono">
          <span>SCENE 01</span>
          <span className="text-[#d97745]">•</span>
          <span>TAKE 01</span>
          <span className="text-[#d97745]">•</span>
          <span className="text-white font-bold">
            <span ref={counterRef}>00</span>%
          </span>
        </div>

        <p className="mt-3 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-stone-500 font-mono">
          CALIBRATING PRODUCTION ACOUSTICS
        </p>
      </div>
    </div>
  );
}
