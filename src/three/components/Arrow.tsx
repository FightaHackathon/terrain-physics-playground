import { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';

export type ArrowProps = {
  origin: THREE.Vector3 | [number, number, number];
  dir: THREE.Vector3 | [number, number, number];
  length: number;
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
    () => (dir instanceof THREE.Vector3 ? dir.clone().normalize() : new THREE.Vector3(...dir).normalize()),
    [dir]
  );

  const args: ThreeElements['primitive']['args'] = [d, o, Math.max(0.001, length), color, headLength, headWidth];
  const arrow = useMemo(() => new THREE.ArrowHelper(...(args as ConstructorParameters<typeof THREE.ArrowHelper>)), [args[0], args[1], args[2], args[3]]);

  // Update values when deps change
  useMemo(() => {
    arrow.position.copy(o);
    arrow.setDirection(d);
    arrow.setLength(Math.max(0.001, length));
    // @ts-ignore color optional
    arrow.setColor?.(new THREE.Color(color as any));
  }, [arrow, o, d, length, color]);

  return <primitive object={arrow} />;
}
