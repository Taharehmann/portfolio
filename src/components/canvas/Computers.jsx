import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile, isTablet }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  // Dynamic responsive scaling and positioning perfectly centered in canvas frame
  const scale = isMobile ? 0.68 : isTablet ? 0.76 : 0.84;
  const position = isMobile
    ? [0, -1.1, -1.0]
    : isTablet
    ? [0, -1.5, -1.2]
    : [0, -1.8, -1.3];

  return (
    <mesh>
      {/* Balanced 360-degree ambient and hemisphere lights */}
      <ambientLight intensity={1.3} />
      <hemisphereLight intensity={0.9} groundColor="#151030" />

      {/* Main key spotlight */}
      <spotLight
        position={[-10, 30, 20]}
        angle={0.3}
        penumbra={1}
        intensity={2.2}
        castShadow
        shadow-mapSize={1024}
      />

      {/* Directional lights for full clarity from front, sides, and top */}
      <directionalLight position={[10, 15, 10]} intensity={1.8} />
      <directionalLight position={[-10, 15, -10]} intensity={1.4} />
      <directionalLight position={[0, 15, -15]} intensity={1.2} />

      {/* Point lights for vibrant cyber-neon RGB glows */}
      <pointLight intensity={2.0} position={[0, 3, 3]} />
      <pointLight intensity={3.0} position={[8, 5, -5]} color="#915EFF" />
      <pointLight intensity={2.5} position={[-8, 4, -4]} color="#00cea8" />
      <pointLight intensity={2.0} position={[0, -1, 3]} color="#BF61FF" />
      <pointLight intensity={2.2} position={[0, 4, -6]} color="#7c8fff" />

      <primitive
        object={computer.scene}
        scale={scale}
        position={position}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: typeof window !== "undefined" ? window.innerWidth <= 640 : false,
    isTablet:
      typeof window !== "undefined"
        ? window.innerWidth > 640 && window.innerWidth <= 1024
        : false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width <= 640,
        isTablet: width > 640 && width <= 1024,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [20, 3, 5],
        fov: screenSize.isMobile ? 28 : 25,
      }}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={2.5}
          enablePan={false}
        />
        <Computers
          isMobile={screenSize.isMobile}
          isTablet={screenSize.isTablet}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
