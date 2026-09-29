import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Icosahedron } from "@react-three/drei";
import { useTheme } from "../context/ThemeContext";

function ElegantParticles({ count = 250, theme }) {
  const mesh = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      const scale = Math.random() * 0.018 + 0.005;
      temp.push({ x, y, z, scale });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.015;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.008;
    }
  });

  const color = theme === "dark" ? "#c9a96e" : "#b8944d";

  return (
    <group ref={mesh}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.scale, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            transparent
            opacity={theme === "dark" ? 0.35 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function GlassSphere({ position, scale, theme }) {
  const color = theme === "dark" ? "#c9a96e" : "#b8944d";

  return (
    <Float speed={0.7} rotationIntensity={0.1} floatIntensity={0.3}>
      <Sphere args={[1, 64, 64]} position={position} scale={scale}>
        <meshPhysicalMaterial
          color={color}
          transmission={0.95}
          thickness={0.5}
          roughness={0.1}
          metalness={0}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={theme === "dark" ? 0.15 : 0.1}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </Sphere>
    </Float>
  );
}

function WireIco({ position, scale, theme }) {
  const mesh = useRef();
  const color = theme === "dark" ? "#c9a96e" : "#b8944d";

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.12;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.18;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  const { theme } = useTheme();

  return (
    <div className="hero-3d-container" key={theme}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={theme === "dark" ? 0.2 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#c9a96e" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />

        <ElegantParticles count={200} theme={theme} />

        {/* فقط سمت چپ (پشت لوگو) - دور از متن */}
        <GlassSphere position={[-5, 2.5, -4]} scale={1.5} theme={theme} />
        <GlassSphere position={[-4, -2, -3]} scale={1} theme={theme} />

        {/* اشکال سیمی - فقط لبه صفحه */}
        <WireIco position={[-6, 3, -5]} scale={0.35} theme={theme} />
        <WireIco position={[6, -3, -5]} scale={0.25} theme={theme} />
        <WireIco position={[6.5, 3.5, -6]} scale={0.3} theme={theme} />
      </Canvas>
    </div>
  );
}
