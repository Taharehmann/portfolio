import React, { useRef, useEffect } from "react";
import { Tilt } from "react-tilt";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";

gsap.registerPlugin(ScrollTrigger);

const useGsap = (elementRef, animation, delay = 0) => {
  useEffect(() => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        animation.from,
        {
          ...animation.to,
          delay,
          scrollTrigger: {
            trigger: elementRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, [elementRef, animation, delay]);
};

const ServiceCard = ({ index, title, icon }) => {
  const cardRef = useRef(null);
  useGsap(cardRef, {
    from: { opacity: 0, y: 100, scale: 0.8, rotateY: 45 },
    to: { opacity: 1, y: 0, scale: 1, rotateY: 0, duration: 1, ease: "power3.out" },
  }, index * 0.2);

  return (
    <Tilt className="w-full sm:w-[250px] max-w-[320px]">
      <div ref={cardRef} className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card service-card-3d">
        <div className="bg-[#151030]/65 backdrop-blur-md border border-white/10 rounded-[20px] py-5 px-6 sm:px-8 min-h-[240px] sm:min-h-[280px] flex justify-evenly items-center flex-col relative overflow-hidden">
          {/* Animated background mesh */}
          <div className="service-card-mesh" />
          <img src={icon} alt="web-development" className="w-14 h-14 sm:w-16 sm:h-16 object-contain relative z-10" />
          <h3 className="text-white text-[18px] sm:text-[20px] font-bold text-center relative z-10 leading-snug">{title}</h3>
        </div>
      </div>
    </Tilt>
  );
};

const About = () => {
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const sectionRef = useRef(null);

  // Heading Animation
  useGsap(headingRef, {
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
  });

  // Paragraph Animation
  useGsap(paragraphRef, {
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
  }, 0.3);

  useEffect(() => {
    // 3D parallax effect on scroll
    gsap.to(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      backgroundPositionY: "40%",
    });
  }, []);

  return (
    <div ref={sectionRef}>
      <div ref={headingRef}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </div>

      <p ref={paragraphRef} className="mt-3 sm:mt-4 text-secondary text-[14px] xs:text-[15px] sm:text-[17px] max-w-3xl leading-[24px] xs:leading-[26px] sm:leading-[30px]">
        I'm a skilled Full Stack Developer with expertise in JavaScript, React, Node.js, Express, 
        and modern web technologies. I build scalable, performant, and visually stunning web applications.
        With a background in Flutter mobile development, I bring a unique cross-platform 
        perspective to every project. I'm a quick learner and collaborate closely with clients to create 
        efficient, scalable, and user-friendly solutions that solve real-world problems. 
        Let's work together to bring your ideas to life!
      </p>

      <div className="mt-12 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-6 sm:gap-8 lg:gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
