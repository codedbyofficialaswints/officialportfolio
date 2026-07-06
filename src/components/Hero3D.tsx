"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useSiteSettings } from "./ThemeProvider";

const COLS = 22;
const ROWS = 13;
const GAP = 0.16;

function TileGrid({ reshuffleSeed }: { reshuffleSeed: number }) {
  const settings = useSiteSettings();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, pointer } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = COLS * ROWS;

  const positions = useMemo(() => {
    const arr: [number, number][] = [];
    const spanX = COLS * GAP;
    const spanY = ROWS * GAP;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        arr.push([x * GAP - spanX / 2, y * GAP - spanY / 2]);
      }
    }
    return arr;
  }, []);

  // per-tile random phase + accent flag, regenerated on reshuffle
  const seeds = useMemo(() => {
    return positions.map(() => ({
      phase: Math.random() * Math.PI * 2,
      accent: Math.random() < 0.12 ? (Math.random() < 0.5 ? 1 : 2) : 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reshuffleSeed]);

  const appliedSeedRef = useRef<number>(-1);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (appliedSeedRef.current !== reshuffleSeed) {
      const ink = new THREE.Color(settings.colors.ink);
      const cobalt = new THREE.Color(settings.colors.cobalt);
      const coral = new THREE.Color(settings.colors.coral);
      seeds.forEach((s, i) => {
        const c = s.accent === 1 ? cobalt : s.accent === 2 ? coral : ink;
        meshRef.current!.setColorAt(i, c);
      });
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
      appliedSeedRef.current = reshuffleSeed;
    }

    const t = state.clock.getElapsedTime();
    const mouseX = pointer.x * (viewport.width / 2);
    const mouseY = pointer.y * (viewport.height / 2);

    positions.forEach(([x, y], i) => {
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ripple = Math.max(0, 1 - dist / 1.4);
      const wave = Math.sin(t * 1.2 + seeds[i].phase) * 0.05;
      const z = ripple * 0.6 + wave;
      const scale = 1 + ripple * 0.8;

      dummy.position.set(x, y, z);
      dummy.scale.set(scale, scale, 1);
      dummy.rotation.z = ripple * 0.3;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[GAP * 0.72, GAP * 0.72]} />
      <meshBasicMaterial vertexColors toneMapped={false} />
    </instancedMesh>
  );
}

export default function Hero3D() {
  const [seed, setSeed] = useState(0);

  return (
    <div
      className="absolute inset-0 cursor-pointer"
      onClick={() => setSeed((s) => s + 1)}
      role="img"
      aria-label="Interactive generative tile grid — click to reshuffle"
    >
      <Canvas
        orthographic
        camera={{ zoom: 120, position: [0, 0, 10] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <TileGrid reshuffleSeed={seed} />
      </Canvas>
    </div>
  );
}
