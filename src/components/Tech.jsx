import React, { useEffect, useRef } from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Tech = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Header animation
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // 3D tech icon animations with stagger
    gsap.fromTo(
      ".tech-icon-card",
      {
        opacity: 0,
        y: 80,
        rotateX: 45,
        scale: 0.7,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.06,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ".tech-icons-wrapper",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef}>
      <div ref={headerRef} className="text-center mb-14">
        <p className={styles.sectionSubText}>Technologies I work with</p>
        <h2 className={styles.sectionHeadText}>Tech Stack.</h2>
      </div>
      <div className="tech-icons-wrapper flex flex-row flex-wrap justify-center items-center gap-2 xs:gap-3 sm:gap-5 md:gap-7 max-w-full px-1">
        {technologies.map((technology) => (
          <div className="tech-icon-card" key={technology.name}>
            <div className="tech-icon-inner p-1.5 xs:p-2 sm:p-3">
              <img
                src={technology.icon}
                alt={technology.name}
                className="w-7 h-7 xs:w-9 xs:h-9 sm:w-14 sm:h-14 object-contain"
              />
              <p className="text-secondary text-[9px] xs:text-[10px] sm:text-[12px] mt-1 sm:mt-1.5 text-center font-medium truncate max-w-[62px] xs:max-w-[76px] sm:max-w-[95px]">
                {technology.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(Tech, "");
