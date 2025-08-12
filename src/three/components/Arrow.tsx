import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export type ArrowProps = {
  origin: THREE.Vector3 | [number, number, number];
  dir: THREE.Vector3 | [number, number, number];
  length?: number; // if omitted, uses |dir| dynamically
  color?: THREE.ColorRepresentation;
  headLength?: number;
  headWidth?: number;
};

export function Arrow({ origin, dir, length, color = 'white', headLength, headWidth }: ArrowProps) {
  const o = useMemo(
    () => (origin instanceof THREE.Vector3 ? origin : new THREE.Vector3(...origin)),
    [origin]
  );
  const d = useMemo(
    () => (dir instanceof THREE.Vector3 ? dir : new THREE.Vector3(...dir)),
    [dir]
  );

  // Create once
  const arrow = useMemo(
    () => new THREE.ArrowHelper(d.clone().normalize(), o, Math.max(0.001, length ?? d.length()), color),
    []
  );

  // Continuously sync to provided vectors to support dynamic updates without re-renders
  useFrame(() => {
    arrow.position.copy(o);
    const nd = d.clone().normalize();
    arrow.setDirection(nd);
    const len = Math.max(0.001, length ?? d.length());
    arrow.setLength(len, headLength, headWidth);
    // @ts-ignore setColor exists on ArrowHelper in newer three versions
    arrow.setColor?.(new THREE.Color(color as any));
  });

  return <primitive object={arrow} />;
}
