import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, Workspace, Scroll3DScene } from "./components";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  useEffect(() => {
    // Initialize Lenis smooth momentum scrolling (Moto-Card style)
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateRaf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    // 3D perspective scroll tilt on sections
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0.4,
          scale: 0.96,
          rotateX: 2.5,
        },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            end: "top 35%",
            scrub: 0.8,
          },
        }
      );
    });

    return () => {
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary min-h-screen text-white overflow-x-hidden'>
        {/* Moto-Card Persistent 3D Scroll Scene */}
        <Scroll3DScene />

        {/* Content Layers */}
        <div className="relative z-10">
          <div className='hero-section-bg'>
            <Navbar />
            <Hero />
          </div>
          <div className="scroll-section">
            <About />
          </div>
          <div className="scroll-section">
            <Workspace />
          </div>
          <div className="scroll-section">
            <Experience />
          </div>
          <div className="scroll-section">
            <Tech />
          </div>
          <div className="scroll-section">
            <Works />
          </div>
          <div className="scroll-section">
            <Feedbacks />
          </div>
          <div className='relative z-0 scroll-section'>
            <Contact />
            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
