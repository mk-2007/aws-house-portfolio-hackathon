"use client";

/** A vase with a small bouquet — pure decoration, the kind of thing an
 *  actual house has in corners/alcoves that this build was missing. */
export default function Vase({
  x,
  z,
  scale = 1,
  potColor = "#4a3420",
}: {
  x: number;
  z: number;
  scale?: number;
  potColor?: string;
}) {
  const flowerColors = ["#7a2620", "#c9a34a", "#e8c8d8", "#f4efe2"];
  return (
    <group position={[x, 0, z]} scale={scale}>
      {/* Pot */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.11, 0.09, 0.32, 12]} />
        <meshStandardMaterial color={potColor} roughness={0.7} />
      </mesh>
      {/* Stems */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`stem-${i}`} position={[Math.sin(i * 1.3) * 0.03, 0.4, Math.cos(i * 1.3) * 0.03]} rotation={[0.08 * i, 0, 0.06 * i]}>
          <cylinderGeometry args={[0.006, 0.006, 0.3, 6]} />
          <meshStandardMaterial color="#3f6b45" roughness={0.85} />
        </mesh>
      ))}
      {/* Blooms */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`bloom-${i}`} position={[Math.sin(i * 1.3) * 0.09, 0.56 + (i % 2) * 0.05, Math.cos(i * 1.3) * 0.09]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={flowerColors[i % flowerColors.length]} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
