import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Arrow } from './Arrow';
import { Face, triangleCentroid, triangleNormal } from '../physics/math';

export function buildTerrainFaces({
  size = 10,
  divisions = 8,
  height = 2.5,
}: { size?: number; divisions?: number; height?: number }) {
  const step = size / divisions;
  const vertices: THREE.Vector3[][] = [];
  
  // Create more interesting height variations
  for (let i = 0; i <= divisions; i++) {
    vertices[i] = [];
    for (let j = 0; j <= divisions; j++) {
      const x = -size / 2 + i * step;
      const z = -size / 2 + j * step;
      
      // Combine multiple noise functions for more interesting terrain
      const noise1 = Math.sin(i * 0.8) * Math.cos(j * 0.8) * 0.4;
      const noise2 = Math.sin(i * 1.3) * Math.cos(j * 0.9) * 0.3;
      const noise3 = Math.sin(i * 2.1) * Math.cos(j * 1.8) * 0.15;
      const randomNoise = (Math.random() - 0.5) * 0.3;
      
      // Create gentle hills and valleys
      const y = (noise1 + noise2 + noise3 + randomNoise) * height * 0.6;
      vertices[i][j] = new THREE.Vector3(x, y, z);
    }
  }

  const faces: Face[] = [];
  let id = 0;
  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
      const a = vertices[i][j];
      const b = vertices[i + 1][j];
      const c = vertices[i][j + 1];
      const d = vertices[i + 1][j + 1];

      // Ensure counter-clockwise winding for upward-facing normals
      const f1n = triangleNormal(a, c, b);
      const f1c = triangleCentroid(a, c, b);
      faces.push({ id: id++, a, b: c, c: b, normal: f1n, centroid: f1c });

      const f2n = triangleNormal(b, c, d);
      const f2c = triangleCentroid(b, c, d);
      faces.push({ id: id++, a: b, b: c, c: d, normal: f2n, centroid: f2c });
    }
  }
  return faces;
}

export function Terrain({
  onFacesReady,
  highlightedFaceId,
}: {
  onFacesReady?: (faces: Face[]) => void;
  highlightedFaceId: number | null;
}) {
  const faces = useMemo(() => buildTerrainFaces({}), []);

  useEffect(() => {
    onFacesReady?.(faces);
  }, [faces, onFacesReady]);

  return (
    <group>
      {faces.map((f) => {
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array([
          f.a.x, f.a.y, f.a.z,
          f.b.x, f.b.y, f.b.z,
          f.c.x, f.c.y, f.c.z,
        ]);
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.computeVertexNormals();
        return (
          <mesh key={f.id} geometry={geom} castShadow receiveShadow>
            <meshLambertMaterial 
              color={highlightedFaceId === f.id ? '#ef4444' : '#22c55e'} 
              polygonOffset 
              polygonOffsetFactor={1} 
              polygonOffsetUnits={1}
            />
          </mesh>
        );
      })}

      {/* Face normals for teaching (blue like in the reference) */}
      {faces.map((f) => (
        <Arrow key={`n-${f.id}`} origin={f.centroid} dir={f.normal} length={0.8} color="#3b82f6" />
      ))}
    </group>
  );
}

export type { Face };
