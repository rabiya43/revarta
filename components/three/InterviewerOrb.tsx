"use client";

import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { BRAND } from "./colors";

export type OrbState = "idle" | "speaking" | "listening" | "thinking";

const STATE_SPEED: Record<OrbState, number> = {
  idle: 0.4,
  speaking: 1.6,
  listening: 0.25,
  thinking: 0.9,
};

export function InterviewerOrb({ state = "idle" }: { state?: OrbState }) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const speed = STATE_SPEED[state];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = 1.35 + Math.sin(t * speed) * 0.04;
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * speed * 2) * (state === "speaking" ? 0.08 : 0.03));
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.3 * speed;
      ringRef.current.rotation.z = t * 0.2 * speed;
    }
  });

  const sparkleCount = state === "speaking" ? 40 : state === "thinking" ? 24 : 16;

  return (
    <group ref={groupRef} position={[0, 1.35, -0.3]}>
      <Float speed={speed} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.28, 2]} />
          <MeshDistortMaterial
            color={BRAND.violet}
            emissive={BRAND.violetLight}
            emissiveIntensity={state === "speaking" ? 1.2 : 0.6}
            roughness={0.15}
            metalness={0.4}
            distort={state === "speaking" ? 0.35 : 0.2}
            speed={speed}
          />
        </mesh>
        <mesh ref={ringRef}>
          <torusGeometry args={[0.42, 0.012, 16, 64]} />
          <meshStandardMaterial
            color={BRAND.coral}
            emissive={BRAND.coral}
            emissiveIntensity={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
        <Sparkles
          count={sparkleCount}
          scale={1.2}
          size={2}
          speed={speed * 0.5}
          color={BRAND.violetLight}
          opacity={0.6}
        />
      </Float>
    </group>
  );
}

export function HeroOrb() {
  const groupRef = useRef<Group>(null);
  const particles = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      pts.push([Math.cos(angle) * 1.4, Math.sin(angle * 0.5) * 0.3, Math.sin(angle) * 1.4]);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh>
          <icosahedronGeometry args={[0.55, 1]} />
          <MeshDistortMaterial
            color={BRAND.violet}
            emissive={BRAND.violetLight}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.5}
            distort={0.25}
            speed={1.5}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.018, 16, 80]} />
          <meshStandardMaterial
            color={BRAND.coral}
            emissive={BRAND.coral}
            emissiveIntensity={0.7}
            transparent
            opacity={0.75}
          />
        </mesh>
        <Sparkles count={50} scale={2.5} size={2.5} speed={0.4} color={BRAND.mint} opacity={0.5} />
      </Float>
      {particles.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <octahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? BRAND.coral : BRAND.mint}
            emissive={i % 2 === 0 ? BRAND.coral : BRAND.mint}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
