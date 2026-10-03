import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";

gsap.registerPlugin(ScrollTrigger);

const Workspace = () => {
  const headerRef = useRef(null);
  const descRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const statsRef = useRef(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    window.dispatchEvent(new CustomEvent("workspace-model-rotate", { detail: { dx, dy } }));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header slide in
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Description fade up
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: descRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 3D Canvas dramatic reveal
      gsap.fromTo(
        canvasWrapperRef.current,
        {
          opacity: 0,
          scale: 0.7,
          rotateY: -15,
          y: 60,
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: canvasWrapperRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.8,
          },
        }
      );

      // Stats counter animation
      gsap.fromTo(
        ".workspace-stat",
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={headerRef}>
        <p className={styles.sectionSubText}>Where the magic happens</p>
        <h2 className={styles.sectionHeadText}>My Workspace.</h2>
      </div>

      <p ref={descRef} className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]">
        This is where ideas come to life. My development setup is optimized for 
        building full-stack applications — from crafting pixel-perfect UIs to 
        engineering robust backend systems. Rotate the 3D model to explore!
      </p>

      {/* Stats Row - 2x2 on mobile, flex-row on desktop */}
      <div ref={statsRef} className="mt-8 sm:mt-10 grid grid-cols-2 sm:flex sm:flex-wrap justify-center lg:justify-start gap-3 sm:gap-6">
        {[
          { number: "10+", label: "Projects Built" },
          { number: "5+", label: "Happy Clients" },
          { number: "17+", label: "Technologies" },
          { number: "1+", label: "Years Experience" },
        ].map((stat, i) => (
          <div key={i} className="workspace-stat w-full sm:w-auto">
            <div className="workspace-stat-inner p-3 sm:p-5">
              <span className="workspace-stat-number text-[24px] sm:text-[32px]">{stat.number}</span>
              <span className="workspace-stat-label text-[11px] sm:text-[13px]">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Computer Canvas */}
      <div
        ref={canvasWrapperRef}
        className="workspace-canvas-wrapper mt-8 sm:mt-12"
        style={{ perspective: "1000px" }}
      >
        <div
          className="workspace-canvas-frame cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: "pan-y" }}
        >
          {/* Decorative corner accents */}
          <div className="workspace-corner workspace-corner-tl" />
          <div className="workspace-corner workspace-corner-tr" />
          <div className="workspace-corner workspace-corner-bl" />
          <div className="workspace-corner workspace-corner-br" />

          <div className="w-full h-[260px] xs:h-[320px] sm:h-[450px] md:h-[550px] lg:h-[600px] flex items-center justify-center">
            {/* The 3D Desktop Computer from Scroll3DScene aligns seamlessly here */}
          </div>

          {/* Interactive hint */}
          <div className="workspace-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10" />
            </svg>
            <span>Drag horizontally to rotate 3D model • Scroll to animate</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Workspace, "workspace");
