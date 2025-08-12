import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Terrain } from "@/three/components/Terrain";
import { Ball } from "@/three/components/Ball";
import type { Face } from "@/three/physics/math";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title: "3D Ball Collision Simulation | Vector Reflection",
    description: "Interactive Three.js demo: shoot a ball at uneven terrain, see normals, projections, and reflections visualized in 3D.",
    canonical: typeof window !== 'undefined' ? window.location.href : undefined,
  });

  const [vx, setVx] = useState(3);
  const [vy, setVy] = useState(6);
  const [vz, setVz] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const [faces, setFaces] = useState<Face[]>([]);
  const [highlightedFaceId, setHighlightedFaceId] = useState<number | null>(null);

  const launchVector = useMemo<[number, number, number]>(() => [vx, vy, vz], [vx, vy, vz]);

  const handleShoot = () => {
    setLaunched(false);
    // small timeout to ensure Ball captures a fresh 'launched' rising edge
    requestAnimationFrame(() => setLaunched(true));
  };

  const handleReset = () => {
    setLaunched(false);
    setResetCount((c) => c + 1);
  };

  const onHighlightFace = (id: number) => {
    setHighlightedFaceId(id);
    setTimeout(() => setHighlightedFaceId(null), 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container py-6">
        <h1 className="text-3xl font-semibold">3D Ball-Terrain Collision Simulation</h1>
        <p className="text-sm text-muted-foreground mt-1">Adjust velocity, shoot the ball, and observe vector math at impact.</p>
      </header>

      <main className="container grid lg:grid-cols-[1fr_320px] gap-6 pb-10">
        <section className="rounded-lg border bg-card">
          <Canvas shadows camera={{ position: [6, 6, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight castShadow position={[6, 10, 4]} intensity={0.9} />

            <group position={[0, 0, 0]}>
              <Terrain onFacesReady={setFaces} highlightedFaceId={highlightedFaceId} />
              <Ball
                faces={faces}
                radius={0.3}
                initialPosition={[0, 0, 0]}
                launched={launched}
                launchVector={launchVector}
                onHighlightFace={onHighlightFace}
                resetCount={resetCount}
                keyboardControl
              />

              {/* Soft ground plane for shadow catch */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[40, 40]} />
                <shadowMaterial opacity={0.15} />
              </mesh>
            </group>

            <OrbitControls enableDamping makeDefault />
          </Canvas>
        </section>

        <aside className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-medium mb-4">Launch Controls</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Velocity X</span><span className="text-muted-foreground">{vx.toFixed(2)}</span></div>
              <Slider value={[vx]} onValueChange={(v) => setVx(v[0])} min={-10} max={10} step={0.1} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Velocity Y</span><span className="text-muted-foreground">{vy.toFixed(2)}</span></div>
              <Slider value={[vy]} onValueChange={(v) => setVy(v[0])} min={-10} max={10} step={0.1} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Velocity Z</span><span className="text-muted-foreground">{vz.toFixed(2)}</span></div>
              <Slider value={[vz]} onValueChange={(v) => setVz(v[0])} min={-10} max={10} step={0.1} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleShoot} disabled={launched} className="flex-1">Shoot</Button>
              <Button variant="secondary" onClick={handleReset} className="flex-1">Reset</Button>
            </div>

            <div className="text-xs text-muted-foreground pt-2">
              Tips: The red arrow shows launch direction before shooting. On impact, red=incoming, green=normal, blue=projection, yellow=reflection.
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Index;
