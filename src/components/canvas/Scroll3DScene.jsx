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

// 3D Computer Desktop Rig - Starts at Introduction (About) section, NOT Landing page
const ScrollComputer = ({ scrollProgress, mouse, isMobile, dragRotation }) => {
  const groupRef = useRef();
  const computer = useGLTF("./desktop_pc/scene.gltf");

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scrollProgress.current; // 0 to 1

    let targetX = 0;
    let targetY = -24;
    let targetZ = -3;
    let targetRotX = 0;
    let targetRotY = -0.2;
    let targetRotZ = 0;
    let targetScale = 0.001;

    // Stage 1: Landing page (Hero) -> Desktop PC stays hidden below the screen
    if (progress < 0.16) {
      targetX = isMobile ? 0 : 1.5;
      targetY = -24;
      targetZ = -3;
      targetRotY = -0.2;
      targetRotX = 0;
      targetScale = 0.001;
    }
    // Stage 2: Emerges smoothly as user reaches the Introduction (About) section
    else if (progress < 0.32) {
      const t = (progress - 0.16) / 0.16;
      const easeT = THREE.MathUtils.smoothstep(t, 0, 1);
      targetX = THREE.MathUtils.lerp(isMobile ? 0 : 1.5, isMobile ? 0 : 2.4, easeT);
      targetY = THREE.MathUtils.lerp(-24, isMobile ? -2.4 : -2.8, easeT);
      targetZ = THREE.MathUtils.lerp(-3, isMobile ? -0.6 : -0.8, easeT);
      targetRotY = THREE.MathUtils.lerp(-0.6, isMobile ? 0.15 : 0.25, easeT);
      targetRotX = THREE.MathUtils.lerp(-0.1, isMobile ? 0.03 : 0.04, easeT);
      targetScale = THREE.MathUtils.lerp(0.001, isMobile ? 0.48 : 0.72, easeT);
    }
    // Stage 3: In Introduction towards Workspace
    else if (progress < 0.46) {
      const t = (progress - 0.32) / 0.14;
      targetX = THREE.MathUtils.lerp(isMobile ? 0 : 2.4, isMobile ? 0 : 1.2, t);
      targetY = THREE.MathUtils.lerp(isMobile ? -2.4 : -2.8, isMobile ? -2.1 : -3.0, t);
      targetZ = THREE.MathUtils.lerp(isMobile ? -0.6 : -0.8, isMobile ? -0.7 : -1.0, t);
      targetRotY = THREE.MathUtils.lerp(isMobile ? 0.15 : 0.25, isMobile ? -0.2 : -0.5, t);
      targetRotX = THREE.MathUtils.lerp(isMobile ? 0.03 : 0.04, -0.02, t);
      targetScale = THREE.MathUtils.lerp(isMobile ? 0.48 : 0.72, isMobile ? 0.50 : 0.74, t);
    }
    // Stage 4: Workspace (0.46 - 0.62) — Epic 360-degree rotating center showcase!
    else if (progress < 0.62) {
      const t = (progress - 0.46) / 0.16;
      targetX = 0;
      targetY = isMobile ? -2.1 : -3.2;
      targetZ = THREE.MathUtils.lerp(isMobile ? -0.7 : -1.0, isMobile ? -0.4 : -0.5, t);
      // Dramatic 360 swoop!
      targetRotY = THREE.MathUtils.lerp(isMobile ? -0.2 : -0.5, Math.PI * 2 - 0.2, t);
      targetRotX = THREE.MathUtils.lerp(-0.02, 0.04, Math.sin(t * Math.PI));
      targetScale = isMobile ? 0.50 : 0.82;
    }
    // Stage 5: Sinking into background for Experience & Projects (0.62 - 0.78)
    else if (progress < 0.78) {
      const t = (progress - 0.62) / 0.16;
      targetX = THREE.MathUtils.lerp(0, isMobile ? -0.5 : -1.5, t);
      targetY = THREE.MathUtils.lerp(isMobile ? -2.1 : -3.2, -22, t);
      targetZ = THREE.MathUtils.lerp(isMobile ? -0.4 : -0.5, -4, t);
      targetRotY = THREE.MathUtils.lerp(Math.PI * 2 - 0.2, Math.PI * 2.5, t);
      targetScale = THREE.MathUtils.lerp(isMobile ? 0.50 : 0.82, 0.001, t);
    }
    // Stage 6: Offscreen while Earth is active
    else {
      targetY = -30;
      targetScale = 0.001; // Avoid 0 to prevent NaN bounding radius
    }

    // Add mouse cursor / touch 3D parallax reaction
    const mouseOffsetX = mouse.current.x * (isMobile ? 0.14 : 0.25);
    const mouseOffsetY = mouse.current.y * (isMobile ? 0.10 : 0.18);

    // Interactive drag rotation in Workspace
    const dragX = dragRotation ? dragRotation.current.x : 0;
    const dragY = dragRotation ? dragRotation.current.y : 0;
    if (dragRotation) {
      dragRotation.current.x = THREE.MathUtils.lerp(dragRotation.current.x, 0, 0.05);
      dragRotation.current.y = THREE.MathUtils.lerp(dragRotation.current.y, 0, 0.05);
    }

    // Smooth Lerp (Ultra-silky 60fps)
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX + mouseOffsetX, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + mouseOffsetY, 0.06);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.06);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX + mouseOffsetY * 0.15 + dragX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY + mouseOffsetX * 0.2 + dragY, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.06);

    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.06);
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 1.5, -24, -3]}>
      <mesh>
        <ambientLight intensity={0.7} />
        <hemisphereLight intensity={0.5} groundColor="#050816" />
        <spotLight
          position={[-15, 40, 15]}
          angle={0.25}
          penumbra={1}
          intensity={1.8}
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight intensity={1.5} position={[0, 4, 3]} />
        {/* Cyber Neon Glows */}
        <pointLight intensity={2.5} position={[8, 5, -6]} color="#915EFF" />
        <pointLight intensity={2.0} position={[-8, 4, -4]} color="#00cea8" />
        <pointLight intensity={1.5} position={[0, -2, 2]} color="#BF61FF" />
        {/* Fill light for back/side rotation */}
        <pointLight intensity={1.8} position={[0, 3, -6]} color="#7c8fff" />
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
const SceneContent = ({ scrollProgress, mouse, isMobile, dragRotation, calculateProgress }) => {
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
    let targetCamX = isMobile ? 12 : 18;
    let targetCamY = isMobile ? 2.6 : 3.2;
    let targetCamZ = isMobile ? 5.2 : 5.5;
    let lookX = 0;
    let lookY = isMobile ? -1.0 : -1.2;
    let lookZ = 0;

    if (progress < 0.20) {
      const t = progress / 0.20;
      targetCamX = THREE.MathUtils.lerp(isMobile ? 12 : 18, isMobile ? 11 : 16, t);
      targetCamY = THREE.MathUtils.lerp(isMobile ? 2.6 : 3.2, isMobile ? 2.5 : 3.0, t);
      targetCamZ = THREE.MathUtils.lerp(isMobile ? 5.2 : 5.5, isMobile ? 5.5 : 6.2, t);
      lookX = 0;
    } else if (progress < 0.46) {
      const t = (progress - 0.20) / 0.26;
      targetCamX = THREE.MathUtils.lerp(isMobile ? 11 : 16, isMobile ? 8 : 11, t);
      targetCamY = THREE.MathUtils.lerp(isMobile ? 2.5 : 3.0, isMobile ? 3.0 : 3.8, t);
      targetCamZ = THREE.MathUtils.lerp(isMobile ? 5.5 : 6.2, isMobile ? 5.4 : 5.8, t);
      lookX = THREE.MathUtils.lerp(isMobile ? 0.2 : 1.0, 0, t);
    } else if (progress < 0.62) {
      targetCamX = isMobile ? 8 : 11;
      targetCamY = isMobile ? 3.0 : 3.8;
      targetCamZ = isMobile ? 5.4 : 5.8;
      lookX = 0;
    } else if (progress < 0.78) {
      const t = (progress - 0.62) / 0.16;
      targetCamX = THREE.MathUtils.lerp(isMobile ? 8 : 11, 2, t);
      targetCamY = THREE.MathUtils.lerp(isMobile ? 3.0 : 3.8, 3.2, t);
      targetCamZ = THREE.MathUtils.lerp(isMobile ? 5.4 : 5.8, 6.5, t);
    } else {
      const t = (progress - 0.78) / 0.22;
      targetCamX = THREE.MathUtils.lerp(2, isMobile ? -2 : -4, t);
      targetCamY = THREE.MathUtils.lerp(3.2, 3.0, t);
      targetCamZ = THREE.MathUtils.lerp(6.5, 6.0, t);
      lookX = 0;
      lookY = THREE.MathUtils.lerp(isMobile ? -1.0 : -1.2, 0, t);
    }

    // Mouse / touch parallax
    const parallaxX = mouse.current.x * (isMobile ? 0.2 : 0.5);
    const parallaxY = mouse.current.y * (isMobile ? 0.12 : 0.3);

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX + parallaxX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY + parallaxY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.05);
    state.camera.lookAt(lookX, lookY, lookZ);
  });

  return (
    <>
      <CosmicStars scrollProgress={scrollProgress} mouse={mouse} />
      <ScrollComputer
        scrollProgress={scrollProgress}
        mouse={mouse}
        isMobile={isMobile}
        dragRotation={dragRotation}
      />
      <ScrollEarth scrollProgress={scrollProgress} mouse={mouse} isMobile={isMobile} />
    </>
  );
};

const Scroll3DScene = () => {
  const scrollProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });
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

    // Interactive model rotation listener from Workspace section
    const handleModelRotate = (e) => {
      if (e.detail) {
        dragRotation.current.y += e.detail.dx * 0.007;
        dragRotation.current.x += e.detail.dy * 0.005;
      }
    };
    window.addEventListener("workspace-model-rotate", handleModelRotate);

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
      window.removeEventListener("workspace-model-rotate", handleModelRotate);
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
            <SceneContent
              scrollProgress={scrollProgress}
              mouse={mouse}
              isMobile={isMobile}
              dragRotation={dragRotation}
              calculateProgress={calculateDynamicProgress}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Status Chips Overlay (Desktop only to prevent mobile clutter) */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden hidden lg:block">
        {/* Stage 2 / Introduction chips (Appears when PC emerges in Introduction) */}
        {pct >= 18 && pct < 46 && (
          <div className="w-full h-full relative max-w-7xl mx-auto">
            <div className="absolute top-[28%] right-[15%] inline-flex moto-floating-chip moto-chip-pulse">
              <span className="moto-chip-dot green" />
              <span className="moto-chip-text">⚡ Full Stack Architecture</span>
            </div>
            <div className="absolute bottom-[24%] right-[25%] inline-flex moto-floating-chip moto-chip-glow">
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
