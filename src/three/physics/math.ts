import * as THREE from 'three';

// Normalize a vector (returns new instance)
export function normalize(v: THREE.Vector3) {
  return v.clone().normalize();
}

// Project vector v onto vector n (not necessarily unit)
export function projectOnto(v: THREE.Vector3, n: THREE.Vector3) {
  const nn = n.lengthSq();
  if (nn === 0) return new THREE.Vector3();
  return n.clone().multiplyScalar(v.dot(n) / nn);
}

// Reflect vector v across normal n (n should be unit for correct magnitude)
// Formula: r = v - 2 * (v · n) * n
export function reflect(v: THREE.Vector3, n: THREE.Vector3) {
  const nUnit = normalize(n);
  return v.clone().sub(nUnit.clone().multiplyScalar(2 * v.dot(nUnit)));
}

// Triangle face normal (unit)
export function triangleNormal(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
  const ab = b.clone().sub(a);
  const ac = c.clone().sub(a);
  return ab.cross(ac).normalize();
}

export function triangleCentroid(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
  return new THREE.Vector3((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3, (a.z + b.z + c.z) / 3);
}

// Signed distance from point p to plane defined by point p0 and normal n (unit not required)
export function planeSignedDistance(p: THREE.Vector3, p0: THREE.Vector3, n: THREE.Vector3) {
  return n.clone().normalize().dot(p.clone().sub(p0));
}

// Check if point p (on the plane) is inside triangle abc using barycentric technique
export function pointInTriangle(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
  const v0 = c.clone().sub(a);
  const v1 = b.clone().sub(a);
  const v2 = p.clone().sub(a);

  const dot00 = v0.dot(v0);
  const dot01 = v0.dot(v1);
  const dot02 = v0.dot(v2);
  const dot11 = v1.dot(v1);
  const dot12 = v1.dot(v2);

  const denom = dot00 * dot11 - dot01 * dot01;
  if (denom === 0) return false;

  const u = (dot11 * dot02 - dot01 * dot12) / denom;
  const v = (dot00 * dot12 - dot01 * dot02) / denom;

  return u >= -1e-6 && v >= -1e-6 && (u + v) <= 1 + 1e-6;
}

export function clampMagnitude(v: THREE.Vector3, max: number) {
  const len = v.length();
  if (len <= max) return v.clone();
  return v.clone().setLength(max);
}

export type Face = {
  id: number;
  a: THREE.Vector3;
  b: THREE.Vector3;
  c: THREE.Vector3;
  normal: THREE.Vector3; // unit
  centroid: THREE.Vector3;
};
