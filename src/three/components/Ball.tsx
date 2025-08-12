import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Arrow } from './Arrow';
import { Face, planeSignedDistance, pointInTriangle, projectOnto, reflect } from '../physics/math';

export function Ball({
  faces,
  radius = 0.25,
  initialPosition = [0, 2, 0],
  launched,
  launchVector,
  onHighlightFace,
  resetCount,
}: {
  faces: Face[];
  radius?: number;
  initialPosition?: [number, number, number];
  launched: boolean;
  launchVector: [number, number, number];
  onHighlightFace?: (id: number) => void;
  resetCount: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const velocityRef = useRef(new THREE.Vector3());
  const [impact, setImpact] = useState<null | {
    point: THREE.Vector3;
    incoming: THREE.Vector3;
    normal: THREE.Vector3;
    projection: THREE.Vector3;
    reflection: THREE.Vector3;
    until: number;
  }>(null);

  const startPos = useMemo(() => new THREE.Vector3(...initialPosition), [initialPosition]);

  // Reset ball
  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.position.copy(startPos);
    velocityRef.current.set(0, 0, 0);
    setImpact(null);
  }, [resetCount, startPos]);

  // Take snapshot of launch velocity when launched becomes true
  const prevLaunched = useRef(false);
  useEffect(() => {
    if (launched && !prevLaunched.current) {
      velocityRef.current.set(launchVector[0], launchVector[1], launchVector[2]);
    }
    prevLaunched.current = launched;
  }, [launched, launchVector]);

  useFrame((_, dt) => {
    const delta = Math.min(dt, 1 / 60);
    if (!launched) return;

    // Integrate
    meshRef.current.position.addScaledVector(velocityRef.current, delta);

    // Check collisions
    const p = meshRef.current.position;

    for (const f of faces) {
      // Check if moving towards the plane
      const n = f.normal.clone().normalize();
      const v = velocityRef.current;
      const approaching = v.dot(n) < 0;
      if (!approaching) continue;

      const dist = planeSignedDistance(p, f.a, n); // positive if in normal direction
      if (dist > radius) continue; // too far from plane

      // collision point projected onto plane
      const projPoint = p.clone().sub(n.clone().multiplyScalar(dist));
      if (!pointInTriangle(projPoint, f.a, f.b, f.c)) continue;

      // Collision!
      onHighlightFace?.(f.id);

      // Move ball out of penetration
      const penetration = radius - dist;
      if (penetration > 0) {
        p.add(n.clone().multiplyScalar(penetration + 1e-3));
      }

      // Vectors for visuals
      const incoming = v.clone();
      const projection = projectOnto(incoming, n); // onto normal
      const reflection = reflect(incoming, n);

      // Update velocity
      velocityRef.current.copy(reflection);

      // Show vectors briefly
      setImpact({
        point: projPoint.clone(),
        incoming,
        normal: n.clone(),
        projection,
        reflection,
        until: performance.now() + 1500,
      });
      break; // handle one face per frame
    }

    // Clear expired visuals
    if (impact && performance.now() > impact.until) {
      setImpact(null);
    }
  });

  // Pre-shot launch arrow
  const showLaunchArrow = !launched && (launchVector[0] !== 0 || launchVector[1] !== 0 || launchVector[2] !== 0);
  const launchDir = useMemo(() => new THREE.Vector3(...launchVector), [launchVector]);

  return (
    <group>
      <mesh ref={meshRef} castShadow position={startPos.toArray()}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={'#60a5fa'} metalness={0.1} roughness={0.7} />
      </mesh>

      {showLaunchArrow && (
        <Arrow origin={meshRef.current ? meshRef.current.position : startPos} dir={launchDir} length={Math.max(0.5, launchDir.length())} color="#ef4444" />
      )}

      {/* Impact vectors */}
      {impact && (
        <group>
          <Arrow origin={impact.point} dir={impact.incoming} length={impact.incoming.length()} color="#ef4444" />
          <Arrow origin={impact.point} dir={impact.normal} length={1} color="#22c55e" />
          <Arrow origin={impact.point} dir={impact.projection} length={impact.projection.length()} color="#3b82f6" />
          <Arrow origin={impact.point} dir={impact.reflection} length={impact.reflection.length()} color="#eab308" />
        </group>
      )}
    </group>
  );
}
