"use client";

import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";
import { BRAND } from "./colors";
import { HeroOrb } from "./InterviewerOrb";

function FloatingShape({
  position,
  color,
  geometry,
}: {
  position: [number, number, number];
  color: string;
  geometry: "box" | "torus";
}) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.3;
      ref.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={position}>
        {geometry === "box" ? (
          <boxGeometry args={[0.25, 0.25, 0.25]} />
        ) : (
          <torusGeometry args={[0.15, 0.04, 12, 32]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function HeroContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={1} color={BRAND.violetLight} />
      <pointLight position={[-3, 1, 2]} intensity={0.6} color={BRAND.coral} />
      <HeroOrb />
      <FloatingShape position={[-1.6, 0.4, 0.5]} color={BRAND.coral} geometry="torus" />
      <FloatingShape position={[1.5, -0.3, 0.2]} color={BRAND.mint} geometry="box" />
      <FloatingShape position={[0.8, 0.8, -0.8]} color={BRAND.violetLight} geometry="torus" />
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <MeshDistortMaterial
          color={BRAND.violet}
          emissive={BRAND.violet}
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
          distort={0.15}
          speed={0.8}
        />
      </mesh>
      <Environment preset="dawn" />
    </>
  );
}

export function HeroSceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="!h-full !w-full"
    >
      <Suspense fallback={null}>
        <HeroContent />
      </Suspense>
    </Canvas>
  );
}
