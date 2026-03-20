import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CrackedWall() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ff4400") },
      uBgColor: { value: new THREE.Color("#050505") }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uBgColor;
      varying vec2 vUv;

      // Pseudo-random noise function
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        // Center coordinates
        vec2 uv = vUv * 2.0 - 1.0;
        
        // Add turbulent noise
        float n = noise(uv * 4.0 + uTime * 0.15) * 0.5;
        float n2 = noise(uv * 8.0 - uTime * 0.1) * 0.25;
        
        // Main vertical crack
        float mainCrack = abs(uv.x + sin(uv.y * 2.0 + n) * 0.3 + n2);
        
        // Branching crack 1
        float branch1 = abs((uv.x - 0.2) - uv.y * 0.8 + sin(uv.y * 5.0) * 0.1 + n);
        // Only show branch on the top right
        branch1 += step(uv.y, 0.0) * 10.0 + step(uv.x, 0.0) * 10.0;
        
        // Combine cracks
        float crack = min(mainCrack, branch1);
        
        // Calculate glow (inverse of distance to crack)
        // Add pulsing effect
        float pulse = 1.0 + 0.3 * sin(uTime * 2.5);
        float glow = (0.015 * pulse) / (crack + 0.001);
        
        // Add subtle background texture variation
        float bgNoise = noise(uv * 10.0) * 0.05;
        vec3 bg = uBgColor + vec3(bgNoise);
        
        vec3 finalColor = mix(bg, uColor, clamp(glow, 0.0, 1.0));
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh scale={[20, 10, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial 
        ref={materialRef} 
        args={[shaderArgs]} 
      />
    </mesh>
  );
}
