import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

import { styles } from "../styles";
import { tahaHero } from "../assets";

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const subtitleRef = useRef(null);
  const badgeRef = useRef(null);
  const particlesRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create particle elements
      if (particlesRef.current) {
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement("div");
          particle.className = "hero-particle";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 6}s`;
          particle.style.animationDuration = `${3 + Math.random() * 4}s`;
          particlesRef.current.appendChild(particle);
        }
      }

      // Main timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Image reveal animation
      tl.fromTo(
        imageRef.current,
        {
          scale: 1.3,
          opacity: 0,
          filter: "blur(20px) brightness(0.3)",
          y: 60,
        },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px) brightness(1)",
          y: 0,
          duration: 1.8,
          ease: "power3.out",
        }
      );

      // Glow pulse effect behind image
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
        "-=1.2"
      );

      // Text reveal
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 80, clipPath: "inset(100% 0 0 0)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1"
      );

      // Subtitle reveal
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      );

      // Badge animation
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.4"
      );

      // Continuous floating animation on image
      gsap.to(imageRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Continuous glow pulse
      gsap.to(glowRef.current, {
        scale: 1.1,
        opacity: 0.6,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative w-full min-h-[100dvh] lg:h-screen mx-auto overflow-hidden flex items-center justify-center">
      {/* Animated particle background */}
      <div ref={particlesRef} className="hero-particles-container" />

      {/* Animated grid background */}
      <div className="hero-grid-bg" />

      {/* Main content */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 gap-8 lg:gap-16 pt-24 pb-16 lg:py-0 relative z-10">
        {/* Left side - Text content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div ref={badgeRef} className="hero-badge mb-3 sm:mb-6">
            <span className="hero-badge-dot" />
            <span>Available for hire</span>
          </div>

          <div ref={textRef}>
            <h1 className={`${styles.heroHeadText} text-white hero-title`}>
              Hi, I'm{" "}
              <span className="hero-name-gradient">Taha</span>
            </h1>
          </div>

          <div ref={subtitleRef} className="w-full flex flex-col items-center lg:items-start">
            <div className={`${styles.heroSubText} mt-2 sm:mt-4 text-white-100 hero-subtitle flex flex-col items-center lg:items-start gap-1`}>
              <span>Full Stack Developer</span>
              <span className="hero-role-tag">
                crafting modern web experiences
              </span>
            </div>

            <div className="hero-tech-pills mt-4 sm:mt-6 flex flex-wrap justify-center lg:justify-start gap-2 max-w-full">
              {["React", "Node.js", "Three.js", "MongoDB"].map((tech, i) => (
                <span key={tech} className="hero-pill" style={{ animationDelay: `${1.5 + i * 0.15}s` }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Profile Image with AI effects */}
        <div className="flex-1 flex justify-center items-center z-10 relative">
          {/* Glow effect behind image */}
          <div ref={glowRef} className="hero-image-glow" />

          {/* Orbit rings */}
          <div className="hero-orbit hero-orbit-1" />
          <div className="hero-orbit hero-orbit-2" />
          <div className="hero-orbit hero-orbit-3" />

          {/* Floating tech icons around image */}
          <div className="hero-floating-icon hero-float-1">⚛️</div>
          <div className="hero-floating-icon hero-float-2">🚀</div>
          <div className="hero-floating-icon hero-float-3">💻</div>
          <div className="hero-floating-icon hero-float-4">🌐</div>

          {/* Profile image with animated border */}
          <div ref={imageRef} className="hero-image-wrapper">
            <div className="hero-image-border" />
            <img
              src={tahaHero}
              alt="Taha - Full Stack Developer"
              className="hero-image"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-3 xs:bottom-6 sm:bottom-10 w-full flex justify-center items-center z-10 pointer-events-auto">
        <a href="#about" aria-label="Scroll to About section">
          <div className="w-[28px] h-[48px] xs:w-[32px] xs:h-[56px] rounded-3xl border-2 sm:border-4 border-secondary flex justify-center items-start p-1.5 sm:p-2">
            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
