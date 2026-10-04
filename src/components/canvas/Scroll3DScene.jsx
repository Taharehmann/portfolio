import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// High-density cosmic starfield with speed warp on scroll
const generateCosmicStars = (count, radius) => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * radius;
    const sinPhi = Math.sin(phi);
    arr[i * 3] = r * sinPhi * Math.cos(theta);
    arr[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
};

const CosmicStars = ({ scrollProgress, mouse }) => {
  const pointsRef = useRef();
  const [sphere] = useState(() => generateCosmicStars(1500, 30));

  useFrame((state) => {
    if (pointsRef.current) {
      const scrollSpeed = scrollProgress.current * 0.8;
      pointsRef.current.rotation.y = scrollSpeed + state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = scrollProgress.current * 0.3 + mouse.current.y * 0.05;
      pointsRef.current.rotation.z = mouse.current.x * 0.05;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#915EFF"
          size={0.07}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.75}
        />
      </Points>
    </group>
  );
};

// 3D Earth Globe with planetary rise animation & lighting for Contact section
const ScrollEarth = ({ scrollProgress, mouse, isMobile }) => {
  const earthRef = useRef();
  const earth = useGLTF("./planet/scene.gltf");

  useFrame((state, delta) => {
    if (!earthRef.current) return;
    const progress = scrollProgress.current;

    let targetY = -22;
    let targetX = isMobile ? 0 : 2.4;
    let targetZ = isMobile ? -3.0 : -1;
    let targetScale = isMobile ? 1.6 : 2.6;

    if (progress > 0.70) {
      const t = Math.min((progress - 0.70) / 0.20, 1);
      targetY = THREE.MathUtils.lerp(-20, isMobile ? -1.8 : 0.0, t);
      targetX = THREE.MathUtils.lerp(isMobile ? 0 : 3.5, isMobile ? 0 : 2.2, t);
      targetZ = THREE.MathUtils.lerp(-3, 0.2, t);
    }

    const mouseOffsetX = mouse.current.x * (isMobile ? 0.15 : 0.25);
    const mouseOffsetY = mouse.current.y * (isMobile ? 0.12 : 0.2);

    earthRef.current.position.x = THREE.MathUtils.lerp(earthRef.current.position.x, targetX + mouseOffsetX, 0.06);
    earthRef.current.position.y = THREE.MathUtils.lerp(earthRef.current.position.y, targetY + mouseOffsetY, 0.06);
    earthRef.current.position.z = THREE.MathUtils.lerp(earthRef.current.position.z, targetZ, 0.06);

    const s = THREE.MathUtils.lerp(earthRef.current.scale.x, targetScale, 0.06);
    earthRef.current.scale.set(s, s, s);

    // Continuous majestic rotation
    earthRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={earthRef} position={[isMobile ? 0 : 2.2, -22, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 12, 6]} intensity={2.2} />
      <pointLight position={[-10, -5, -4]} color="#915EFF" intensity={1.6} />
      <pointLight position={[5, -8, 2]} color="#00CEA8" intensity={1.2} />

      <primitive object={earth.scene} scale={1} />
    </group>
  );
};

// Main Scene Controller & Camera with Dynamic Trajectory + Mouse Parallax
const SceneContent = ({ scrollProgress, mouse, isMobile, calculateProgress }) => {
  useFrame((state) => {
    // Dynamic FOV for portrait/mobile vs desktop
    const targetFov = isMobile ? 38 : 25;
    if (Math.abs(state.camera.fov - targetFov) > 0.1) {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, 0.1);
      state.camera.updateProjectionMatrix();
    }

    // Continuously update dynamic scroll progress in sync with rendering frame
    if (calculateProgress) {
      scrollProgress.current = calculateProgress();
    }
    const progress = scrollProgress.current;

    // Cinematic camera trajectory on scroll
    let targetCamX = 0;
    let targetCamY = 0;
    let targetCamZ = 6;
    let lookX = 0;
    let lookY = 0;
    let lookZ = 0;

    if (progress > 0.70) {
      const t = Math.min((progress - 0.70) / 0.22, 1);
      targetCamX = THREE.MathUtils.lerp(0, isMobile ? 0 : -2.5, t);
      targetCamY = THREE.MathUtils.lerp(0, isMobile ? 1.5 : 1.2, t);
      targetCamZ = THREE.MathUtils.lerp(6, 6.2, t);
      lookX = THREE.MathUtils.lerp(0, isMobile ? 0 : 1.2, t);
      lookY = THREE.MathUtils.lerp(0, isMobile ? -0.8 : 0, t);
    }

    // Mouse / touch parallax
    const parallaxX = mouse.current.x * (isMobile ? 0.2 : 0.4);
    const parallaxY = mouse.current.y * (isMobile ? 0.12 : 0.25);

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX + parallaxX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY + parallaxY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.05);
    state.camera.lookAt(lookX, lookY, lookZ);
  });

  return (
    <>
      <CosmicStars scrollProgress={scrollProgress} mouse={mouse} />
      <ScrollEarth scrollProgress={scrollProgress} mouse={mouse} isMobile={isMobile} />
    </>
  );
};

const Scroll3DScene = () => {
  const scrollProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState("Hero");
  const [pct, setPct] = useState(0);

  // Dynamic landmark-based scroll calculation that works accurately across mobile and desktop
  const calculateDynamicProgress = () => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const vh = window.innerHeight || 800;
    const totalDocHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - vh;
    if (totalDocHeight <= 0) return 0;

    const aboutEl = document.getElementById("about");
    const workspaceEl = document.getElementById("workspace");
    const workEl = document.getElementById("work");
    const contactEl = document.getElementById("contact");

    if (!aboutEl || !workspaceEl || !contactEl) {
      return Math.min(Math.max(scrollY / totalDocHeight, 0), 1);
    }

    const getDocTop = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top + scrollY;
    };

    const aboutTop = Math.max(getDocTop(aboutEl) - vh * 0.4, 100);
    const workspaceTop = Math.max(getDocTop(workspaceEl) - vh * 0.25, aboutTop + 150);
    const workTop = workEl ? Math.max(getDocTop(workEl) - vh * 0.25, workspaceTop + 200) : workspaceTop + 1200;
    const contactTop = Math.max(getDocTop(contactEl) - vh * 0.5, workTop + 200);

    let p = 0;
    if (scrollY < aboutTop) {
      // Landing page (Hero)
      const ratio = Math.min(Math.max(scrollY / aboutTop, 0), 1);
      p = ratio * 0.16;
    } else if (scrollY < workspaceTop) {
      // Introduction (About) section
      const ratio = (scrollY - aboutTop) / (workspaceTop - aboutTop);
      p = 0.16 + ratio * 0.30;
    } else if (scrollY < workTop) {
      // Workspace section
      const ratio = (scrollY - workspaceTop) / (workTop - workspaceTop);
      p = 0.46 + ratio * 0.16;
    } else if (scrollY < contactTop) {
      // Experience / Projects
      const ratio = (scrollY - workTop) / (contactTop - workTop);
      p = 0.62 + ratio * 0.16;
    } else {
      // Contact section
      const remaining = Math.max(totalDocHeight - contactTop, 1);
      const ratio = Math.min(Math.max((scrollY - contactTop) / remaining, 0), 1);
      p = 0.78 + ratio * 0.22;
    }

    return Math.min(Math.max(p, 0), 1);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Track mouse & touch events for parallax
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        mouse.current.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    const handleScroll = () => {
      const progress = calculateDynamicProgress();
      scrollProgress.current = progress;
      setPct(Math.round(progress * 100));

      if (progress < 0.16) setCurrentSection("Hero");
      else if (progress < 0.46) setCurrentSection("Introduction");
      else if (progress < 0.62) setCurrentSection("Workspace");
      else if (progress < 0.75) setCurrentSection("Experience");
      else if (progress < 0.85) setCurrentSection("Projects");
      else setCurrentSection("Global Contact");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Fixed Fullscreen 3D Viewport for Cosmic Starfield & Earth */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 25 }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            <SceneContent
              scrollProgress={scrollProgress}
              mouse={mouse}
              isMobile={isMobile}
              calculateProgress={calculateDynamicProgress}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Status Chips Overlay for Contact Earth (Desktop only) */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden hidden lg:block">
        {pct > 68 && (
          <div className="w-full h-full relative max-w-7xl mx-auto">
            <div className="absolute top-[28%] right-[10%] inline-flex moto-floating-chip moto-chip-glow">
              <span className="moto-chip-dot green" />
              <span className="moto-chip-text">🌍 Available Globally</span>
            </div>
            <div className="absolute bottom-[24%] right-[22%] inline-flex moto-floating-chip moto-chip-pulse">
              <span className="moto-chip-dot cyan" />
              <span className="moto-chip-text">🚀 Fast Global Delivery</span>
            </div>
          </div>
        )}
      </div>

      {/* Moto-Card Style 3D Scroll HUD Indicator (Desktop only) */}
      <div className="moto-scroll-hud hidden lg:flex">
        <div className="moto-hud-track">
          <div
            className="moto-hud-progress"
            style={{ height: `${pct}%` }}
          />
        </div>
        <div className="moto-hud-info">
          <span className="moto-hud-section">{currentSection}</span>
          <span className="moto-hud-pct">{pct}%</span>
        </div>
      </div>
    </>
  );
};

export default Scroll3DScene;
