import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Arrow } from './Arrow';
import { Face, triangleCentroid, triangleNormal } from '../physics/math';

export function buildTerrainFaces({
  size = 8,
  divisions = 5,
  height = 1.5,
}: { size?: number; divisions?: number; height?: number }) {
  const step = size / divisions;
  const vertices: THREE.Vector3[][] = [];
  for (let i = 0; i <= divisions; i++) {
    vertices[i] = [];
    for (let j = 0; j <= divisions; j++) {
      const x = -size / 2 + i * step;
      const z = -size / 2 + j * step;
      const y = (Math.sin(i * 0.9) + Math.cos(j * 1.1)) * 0.3 + (Math.random() - 0.5) * (height / 3);
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

      const f1n = triangleNormal(a, b, c);
      const f1c = triangleCentroid(a, b, c);
      faces.push({ id: id++, a, b, c, normal: f1n, centroid: f1c });

      const f2n = triangleNormal(b, d, c);
      const f2c = triangleCentroid(b, d, c);
      faces.push({ id: id++, a: b, b: d, c, normal: f2n, centroid: f2c });
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
            <meshStandardMaterial color={highlightedFaceId === f.id ? '#ef4444' : '#9ca3af'} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
          </mesh>
        );
      })}

      {/* Face normals for teaching (green) */}
      {faces.map((f) => (
        <Arrow key={`n-${f.id}`} origin={f.centroid} dir={f.normal} length={0.6} color="#22c55e" />
      ))}
    </group>
  );
}

export type { Face };
