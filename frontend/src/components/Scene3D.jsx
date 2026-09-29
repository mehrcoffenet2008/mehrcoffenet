import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Box, Torus } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 500 }) {
  const mesh = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;
      const scale = Math.random() * 0.03 + 0.01;
      temp.push({ x, y, z, scale });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group ref={mesh}>
      {particles.map((particle, i) => (
        <mesh key={i} position={[particle.x, particle.y, particle.z]}>
          <sphereGeometry args={[particle.scale, 8, 8]} />
          <meshStandardMaterial
            color="#f5d58a"
            emissive="#f5d58a"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingShape({ position, speed = 1, distort = 0.3, color = "#f5d58a" }) {
  const mesh = useRef();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.8}
          distort={distort}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function GoldenRing({ position, rotation = [0, 0, 0] }) {
  const mesh = useRef();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={mesh} position={position} rotation={rotation}>
      <torusGeometry args={[1.5, 0.03, 16, 100]} />
      <meshStandardMaterial
        color="#f5d58a"
        emissive="#f5d58a"
        emissiveIntensity={0.8}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

function GlassSphere({ position, scale = 1 }) {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#f5d58a"
          transmission={0.9}
          thickness={0.5}
          roughness={0}
          metalness={0}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="scene-3d-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#f5d58a" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d5a957" />
        <spotLight
          position={[0, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#fff5e0"
        />

        <Particles count={400} />
        <FloatingShape position={[-3, 1, -2]} speed={0.8} distort={0.4} />
        <FloatingShape position={[3.5, -1, -1]} speed={1.2} distort={0.2} color="#d5a957" />
        <FloatingShape position={[0, 2.5, -3]} speed={0.6} distort={0.5} color="#f8d991" />
        <GoldenRing position={[0, 0, -2]} rotation={[Math.PI / 4, 0, 0]} />
        <GoldenRing position={[0, 0, -2]} rotation={[Math.PI / 3, Math.PI / 6, 0]} />
        <GlassSphere position={[-2, -1.5, 0]} scale={0.8} />
        <GlassSphere position={[2.5, 1, -1]} scale={0.6} />
      </Canvas>
    </div>
  );
}
