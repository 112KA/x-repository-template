import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Stats from "stats-gl";

function StatsGl() {
  const gl = useThree((state) => state.gl);
  const statsRef = useRef<Stats | null>(null);

  useEffect(() => {
    const stats = new Stats();
    statsRef.current = stats;
    document.body.appendChild(stats.dom);
    void stats.init(gl);

    return () => {
      statsRef.current = null;
      stats.dispose();
      stats.dom.remove();
    };
  }, [gl]);

  useFrame(() => {
    statsRef.current?.update();
  });

  return null;
}

export default function R3fExample() {
  return (
    <section className="h-full">
      <Canvas>
        <color attach="background" args={["black"]} />
        <mesh>
          <boxGeometry />
          <meshNormalMaterial />
        </mesh>
        <OrbitControls />
        <StatsGl />
      </Canvas>
    </section>
  );
}
