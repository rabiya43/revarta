"use client";

import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { BRAND } from "./colors";
import { InterviewerOrb, type OrbState } from "./InterviewerOrb";

function Room() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <spotLight
        position={[2, 4, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.2}
        color={BRAND.violetLight}
        castShadow
      />
      <pointLight position={[-2, 2, 1]} intensity={0.6} color={BRAND.coral} />
      <pointLight position={[0, 1.5, -1]} intensity={0.4} color={BRAND.mint} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={BRAND.inkMuted} roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Desk */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.06, 0.9]} />
        <meshStandardMaterial color="#3d3654" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[-0.65, 0.19, 0]} castShadow>
        <boxGeometry args={[0.06, 0.38, 0.06]} />
        <meshStandardMaterial color="#2a2540" />
      </mesh>
      <mesh position={[0.65, 0.19, 0]} castShadow>
        <boxGeometry args={[0.06, 0.38, 0.06]} />
        <meshStandardMaterial color="#2a2540" />
      </mesh>

      {/* Interviewer chair (back) */}
      <group position={[0, 0, -0.55]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshStandardMaterial color="#352f4a" />
        </mesh>
        <mesh position={[0, 0.55, -0.2]} castShadow>
          <boxGeometry args={[0.5, 0.55, 0.06]} />
          <meshStandardMaterial color="#352f4a" />
        </mesh>
      </group>

      {/* Candidate chair (front, subtle) */}
      <group position={[0, 0, 0.75]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.45, 0.05, 0.45]} />
          <meshStandardMaterial color="#2d2840" />
        </mesh>
      </group>

      {/* Back wall accent panel */}
      <mesh position={[0, 1.2, -1.2]} receiveShadow>
        <planeGeometry args={[3.5, 2.2]} />
        <meshStandardMaterial
          color={BRAND.ink}
          emissive={BRAND.violet}
          emissiveIntensity={0.08}
          roughness={0.9}
        />
      </mesh>

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.45}
        scale={6}
        blur={2.5}
        far={4}
      />
      <Environment preset="city" />
    </>
  );
}

function SceneContent({ orbState }: { orbState: OrbState }) {
  return (
    <>
      <Room />
      <InterviewerOrb state={orbState} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.2}
        minAzimuthAngle={-0.4}
        maxAzimuthAngle={0.4}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

export function InterviewRoomCanvas({ orbState = "idle" }: { orbState?: OrbState }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.6, 2.8], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!h-full !w-full"
    >
      <color attach="background" args={[BRAND.ink]} />
      <fog attach="fog" args={[BRAND.ink, 4, 9]} />
      <Suspense fallback={null}>
        <SceneContent orbState={orbState} />
      </Suspense>
    </Canvas>
  );
}
