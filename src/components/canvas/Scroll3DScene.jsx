import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import * as random from "maath/random/dist/maath-random.esm";

// High-density cosmic starfield with speed warp on scroll
const CosmicStars = ({ scrollProgress, mouse }) => {
  const pointsRef = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(4000), { radius: 30 }));

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Warp speed rotation driven by scroll + elapsed time
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

// 3D Computer Desktop Rig with cinematic scroll choreography & mouse reaction
const ScrollComputer = ({ scrollProgress, mouse, isMobile }) => {
  const groupRef = useRef();
  const computer = useGLTF("./desktop_pc/scene.gltf");

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scrollProgress.current; // 0 to 1

    let targetX = 0;
    let targetY = -3.2;
    let targetZ = -1.2;
    let targetRotX = -0.01;
    let targetRotY = -0.2;
    let targetRotZ = 0;
    let targetScale = isMobile ? 0.42 : 0.72;

    // Stage 1: Hero (0.00 - 0.20)
    if (progress < 0.20) {
      const t = progress / 0.20;
      targetX = THREE.MathUtils.lerp(isMobile ? 0 : 0.6, isMobile ? 0 : 1.8, t);
      // On mobile, keep computer tucked away so hero portrait and headline are completely clean
      targetY = isMobile ? -16 : THREE.MathUtils.lerp(-3.2, -2.8, t);
      targetZ = isMobile ? -5 : THREE.MathUtils.lerp(-1.2, -0.6, t);
      targetRotY = THREE.MathUtils.lerp(-0.2, 0.35, t);
      targetRotX = THREE.MathUtils.lerp(-0.01, 0.05, t);
      targetScale = isMobile ? 0 : THREE.MathUtils.lerp(0.72, 0.74, t);
    }
    // Stage 2: About (0.20 - 0.42) — Pans right on desktop; smoothly surfaces towards Workspace
    else if (progress < 0.42) {
      const t = (progress - 0.20) / 0.22;
      targetX = THREE.MathUtils.lerp(isMobile ? 0 : 1.8, isMobile ? 0 : 2.8, t);
      targetY = THREE.MathUtils.lerp(isMobile ? -16 : -2.8, isMobile ? -2.6 : -3.0, t);
      targetZ = THREE.MathUtils.lerp(isMobile ? -5 : -0.6, isMobile ? -2.0 : -1.2, t);
      targetRotY = THREE.MathUtils.lerp(0.35, -0.65, t);
      targetRotX = THREE.MathUtils.lerp(0.05, -0.02, t);
      targetScale = THREE.MathUtils.lerp(isMobile ? 0 : 0.70, isMobile ? 0.36 : 0.70, t);
    }
    // Stage 3: Workspace (0.42 - 0.60) — Epic 360-degree rotating center showcase!
    else if (progress < 0.60) {
      const t = (progress - 0.42) / 0.18;
      targetX = 0;
      targetY = isMobile ? -2.6 : -3.2;
      targetZ = THREE.MathUtils.lerp(isMobile ? -2.0 : -1.2, isMobile ? -1.5 : -0.5, t);
      // Dramatic 360 swoop!
      targetRotY = THREE.MathUtils.lerp(-0.65, Math.PI * 2 - 0.2, t);
      targetRotX = THREE.MathUtils.lerp(-0.02, 0.04, Math.sin(t * Math.PI));
      targetScale = isMobile ? 0.38 : 0.82;
    }
    // Stage 4: Sinking into background for Experience & Projects (0.60 - 0.76)
    else if (progress < 0.76) {
      const t = (progress - 0.60) / 0.16;
      targetX = THREE.MathUtils.lerp(0, -1.5, t);
      targetY = THREE.MathUtils.lerp(isMobile ? -2.6 : -3.2, -18, t);
      targetZ = THREE.MathUtils.lerp(-0.5, -4, t);
      targetRotY = THREE.MathUtils.lerp(Math.PI * 2 - 0.2, Math.PI * 2.5, t);
      targetScale = THREE.MathUtils.lerp(isMobile ? 0.38 : 0.82, 0.1, t);
    }
    // Stage 5: Offscreen while Earth is active
    else {
      targetY = -30;
      targetScale = 0;
    }

    // Add mouse cursor 3D parallax reaction
    const mouseOffsetX = mouse.current.x * 0.25;
    const mouseOffsetY = mouse.current.y * 0.18;

    // Smooth Lerp (Ultra-silky 60fps)
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX + mouseOffsetX, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + mouseOffsetY, 0.06);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.06);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX + mouseOffsetY * 0.15, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY + mouseOffsetX * 0.2, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.06);

    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.06);
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} position={[0.6, -3.2, -1.2]}>
      <mesh>
        <ambientLight intensity={0.5} />
        <hemisphereLight intensity={0.4} groundColor="#050816" />
        <spotLight
          position={[-15, 40, 15]}
          angle={0.2}
          penumbra={1}
          intensity={1.5}
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight intensity={1.2} position={[0, 4, 3]} />
        {/* Cyber Neon Glows */}
        <pointLight intensity={2.2} position={[8, 5, -6]} color="#915EFF" />
        <pointLight intensity={1.8} position={[-8, 4, -4]} color="#00cea8" />
        <pointLight intensity={1.2} position={[0, -2, 2]} color="#BF61FF" />
        <primitive object={computer.scene} position={[0, 0, 0]} />
      </mesh>
    </group>
  );
};

// 3D Earth Globe with planetary rise animation & lighting
const ScrollEarth = ({ scrollProgress, mouse, isMobile }) => {
  const earthRef = useRef();
  const earth = useGLTF("./planet/scene.gltf");

  useFrame((state, delta) => {
    if (!earthRef.current) return;
    const progress = scrollProgress.current;

    let targetY = -22;
    let targetX = isMobile ? 0 : 2.4;
    let targetZ = isMobile ? -3.5 : -1;
    let targetScale = isMobile ? 1.3 : 2.6;

    if (progress > 0.70) {
      // Emerges smoothly like Moto-card's planetary horizon!
      const t = Math.min((progress - 0.70) / 0.20, 1);
      targetY = THREE.MathUtils.lerp(-20, isMobile ? -2.2 : 0.0, t);
      targetX = THREE.MathUtils.lerp(isMobile ? 0 : 3.5, isMobile ? 0 : 2.2, t);
      targetZ = THREE.MathUtils.lerp(-3, 0.2, t);
    }

    const mouseOffsetX = mouse.current.x * 0.25;
    const mouseOffsetY = mouse.current.y * 0.2;

    earthRef.current.position.x = THREE.MathUtils.lerp(earthRef.current.position.x, targetX + mouseOffsetX, 0.06);
    earthRef.current.position.y = THREE.MathUtils.lerp(earthRef.current.position.y, targetY + mouseOffsetY, 0.06);
    earthRef.current.position.z = THREE.MathUtils.lerp(earthRef.current.position.z, targetZ, 0.06);

    const s = THREE.MathUtils.lerp(earthRef.current.scale.x, targetScale, 0.06);
    earthRef.current.scale.set(s, s, s);

    // Continuous majestic rotation
    earthRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={earthRef} position={[2.2, -22, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 12, 6]} intensity={2.2} />
      <pointLight position={[-10, -5, -4]} color="#915EFF" intensity={1.6} />
      <pointLight position={[5, -8, 2]} color="#00CEA8" intensity={1.2} />

      <primitive object={earth.scene} scale={1} />
    </group>
  );
};

// Main Scene Controller & Camera with Dynamic Trajectory + Mouse Parallax
const SceneContent = ({ scrollProgress, mouse, isMobile }) => {
  useFrame((state) => {
    const progress = scrollProgress.current;

    // Cinematic 3/4 camera trajectory on scroll
    // Stage 1 (Hero): Classic high-end 3/4 perspective [18, 3, 5.5]
    // Stage 2 (About): Sweeps to side [14, 2.5, 7.5]
    // Stage 3 (Workspace): Centers in [12, 3.8, 6.2]
    // Stage 4 (Contact): Transitions to Earth camera [-4, 3, 6]
    let targetCamX = 18;
    let targetCamY = 3.2;
    let targetCamZ = 5.5;
    let lookX = 0;
    let lookY = -1.2;
    let lookZ = 0;

    if (progress < 0.25) {
      const t = progress / 0.25;
      targetCamX = THREE.MathUtils.lerp(18, 14, t);
      targetCamY = THREE.MathUtils.lerp(3.2, 2.6, t);
      targetCamZ = THREE.MathUtils.lerp(5.5, 7.0, t);
      lookX = THREE.MathUtils.lerp(0, 1.2, t);
    } else if (progress < 0.55) {
      const t = (progress - 0.25) / 0.30;
      targetCamX = THREE.MathUtils.lerp(14, 11, t);
      targetCamY = THREE.MathUtils.lerp(2.6, 3.8, t);
      targetCamZ = THREE.MathUtils.lerp(7.0, 5.8, t);
      lookX = THREE.MathUtils.lerp(1.2, 0, t);
    } else if (progress < 0.75) {
      const t = (progress - 0.55) / 0.20;
      targetCamX = THREE.MathUtils.lerp(11, 2, t);
      targetCamY = THREE.MathUtils.lerp(3.8, 3.2, t);
      targetCamZ = THREE.MathUtils.lerp(5.8, 6.5, t);
    } else {
      const t = (progress - 0.75) / 0.25;
      targetCamX = THREE.MathUtils.lerp(2, -4, t);
      targetCamY = THREE.MathUtils.lerp(3.2, 3.0, t);
      targetCamZ = THREE.MathUtils.lerp(6.5, 6.0, t);
      lookX = THREE.MathUtils.lerp(0, 0, t);
      lookY = THREE.MathUtils.lerp(-1.2, 0, t);
    }

    // Mouse parallax
    const parallaxX = mouse.current.x * 0.5;
    const parallaxY = mouse.current.y * 0.3;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX + parallaxX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY + parallaxY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.05);
    state.camera.lookAt(lookX, lookY, lookZ);
  });

  return (
    <>
      <CosmicStars scrollProgress={scrollProgress} mouse={mouse} />
      <ScrollComputer scrollProgress={scrollProgress} mouse={mouse} isMobile={isMobile} />
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
      scrollProgress.current = progress;
      setPct(Math.round(progress * 100));

      // Realtime Section calculation for HUD
      if (progress < 0.18) setCurrentSection("Hero");
      else if (progress < 0.38) setCurrentSection("About");
      else if (progress < 0.55) setCurrentSection("Workspace");
      else if (progress < 0.72) setCurrentSection("Experience");
      else if (progress < 0.86) setCurrentSection("Projects");
      else setCurrentSection("Global Contact");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Fixed Fullscreen 3D Viewport */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [18, 3.2, 5.5], fov: 25 }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            <SceneContent scrollProgress={scrollProgress} mouse={mouse} isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </div>

      {/* Moto-Card Floating Status Chips Overlay (Desktop only to prevent mobile clutter) */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden hidden lg:block">
        {/* Stage 1 / Hero chips */}
        {pct < 32 && (
          <div className="w-full h-full relative max-w-7xl mx-auto">
            <div className="absolute top-[24%] left-[47%] inline-flex moto-floating-chip moto-chip-pulse">
              <span className="moto-chip-dot green" />
              <span className="moto-chip-text">⚡ Full Stack Architecture</span>
            </div>
            <div className="absolute bottom-[20%] left-[28%] inline-flex moto-floating-chip moto-chip-glow">
              <span className="moto-chip-dot purple" />
              <span className="moto-chip-text">✨ 3D WebGL & GSAP</span>
            </div>
          </div>
        )}

        {/* Stage 5 / Contact Earth chips */}
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
