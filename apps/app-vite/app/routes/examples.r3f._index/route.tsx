import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

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
      </Canvas>
    </section>
  );
}
