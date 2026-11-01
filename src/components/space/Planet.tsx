"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlanetTexture } from "./usePlanetTexture";

/**
 * A procedural Earth-like world, lit by the sun.
 *
 * Realism comes from three real-world effects, none of which need a texture:
 *  1. Day/night: brightness follows dot(surface normal, sun direction), with a
 *     soft terminator (the sunrise line) instead of a hard edge.
 *  2. City lights glow on the dark side, but only over land.
 *  3. A thin blue atmosphere that glows at the rim (the Fresnel effect: the
 *     more edge-on you look at a surface, the more atmosphere you see through).
 */
const vertex = /* glsl */ `
  varying vec3 vP;
  varying vec3 vWN;
  void main() {
    vP = position;
    vWN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uSun;
  uniform sampler2D uMap;
  varying vec3 vP;
  varying vec3 vWN;
  void main() {
    vec3 p = normalize(vP);
    float phi = atan(p.z, p.x);
    if (phi < 0.0) phi += 6.2831853;
    vec2 uv = vec2(phi / 6.2831853, asin(clamp(p.y, -1.0, 1.0)) / 3.14159265 + 0.5);
    vec4 tex = texture2D(uMap, uv);

    float ndl = dot(normalize(vWN), uSun);
    float day = smoothstep(-0.06, 0.38, ndl);
    vec3 lit = tex.rgb * (0.015 + day * 1.55);

    // city lights glow only on the dark side
    float night = smoothstep(0.08, -0.28, ndl);
    lit += vec3(1.0, 0.72, 0.38) * tex.a * night * 1.5;

    // warm sunrise tint right on the terminator
    lit += vec3(1.0, 0.45, 0.18) * smoothstep(-0.02, 0.1, ndl) * smoothstep(0.3, 0.0, ndl) * 0.1;
    gl_FragColor = vec4(lit, 1.0);
  }
`;

const atmoVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vWN;
  void main() {
    vN = normalize(normalMatrix * normal);
    vWN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmoFragment = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vN;
  varying vec3 vWN;
  void main() {
    float rim = pow(0.72 - dot(vN, vec3(0.0, 0.0, 1.0)), 3.0);
    float sunSide = clamp(dot(normalize(vWN), uSun) + 0.35, 0.0, 1.0);
    vec3 col = mix(vec3(0.15, 0.4, 1.0), vec3(0.6, 0.8, 1.0), sunSide);
    gl_FragColor = vec4(col * rim * (0.15 + sunSide * 1.6), rim);
  }
`;

export default function Planet({
  position,
  radius,
  sunDir,
}: {
  position: [number, number, number];
  radius: number;
  sunDir: THREE.Vector3;
}) {
  const body = useRef<THREE.Mesh>(null);
  const map = usePlanetTexture();
  const uniforms = useMemo(() => ({ uSun: { value: sunDir.clone().normalize() }, uMap: { value: null as THREE.Texture | null } }), [sunDir]);
  uniforms.uMap.value = map;
  const atmoUniforms = useMemo(() => ({ uSun: { value: sunDir.clone().normalize() } }), [sunDir]);

  useFrame(({ clock }) => {
    if (body.current) body.current.rotation.y = clock.getElapsedTime() * 0.012;
  });

  if (!map) return null;
  return (
    <group position={position}>
      <mesh ref={body} rotation={[0.35, 0, 0.2]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} />
      </mesh>
      <mesh scale={1.07}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          uniforms={atmoUniforms}
          vertexShader={atmoVertex}
          fragmentShader={atmoFragment}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
