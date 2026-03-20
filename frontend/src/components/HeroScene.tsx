import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CrackedWall } from "./CrackedWall";

export function HeroScene() {
  return (
    <div className="absolute inset-0 bg-[#050505] -z-10 cursor-move">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
        {/* Subtle camera wiggle controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={0.3} 
          maxPolarAngle={Math.PI / 2 + 0.15} 
          minPolarAngle={Math.PI / 2 - 0.15} 
          maxAzimuthAngle={0.2} 
          minAzimuthAngle={-0.2} 
        />
        <CrackedWall />
      </Canvas>
    </div>
  );
}
