"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NOISE_GLSL } from "./noiseGlsl";

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
  uniform float uTime;
  varying vec3 vP;
  varying vec3 vWN;
  ${NOISE_GLSL}
  void main() {
    vec3 p = normalize(vP);
    float land = fbm(p * 2.6 + vec3(3.0));
    float coast = smoothstep(0.50, 0.535, land);
    vec3 ocean = mix(vec3(0.01, 0.05, 0.17), vec3(0.03, 0.17, 0.42), fbm(p * 8.0));
    vec3 ground = mix(vec3(0.17, 0.27, 0.09), vec3(0.58, 0.47, 0.31), smoothstep(0.55, 0.78, land));
    vec3 surf = mix(ocean, ground, coast);

    float cloud = smoothstep(0.50, 0.78, fbm(p * 4.2 + vec3(uTime * 0.012, 0.0, 0.0)));
    surf = mix(surf, vec3(1.0), cloud * 0.85);

    float ndl = dot(normalize(vWN), uSun);
    float day = smoothstep(-0.06, 0.38, ndl);
    vec3 lit = surf * (0.015 + day * 1.55);

    float night = smoothstep(0.08, -0.28, ndl) * coast * (1.0 - cloud);
    float city = step(0.80, vnoise(p * 70.0)) * night;
    lit += vec3(1.0, 0.72, 0.38) * city * 1.5;

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
  const uniforms = useMemo(() => ({ uSun: { value: sunDir.clone().normalize() }, uTime: { value: 0 } }), [sunDir]);
  const atmoUniforms = useMemo(() => ({ uSun: { value: sunDir.clone().normalize() } }), [sunDir]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    if (body.current) body.current.rotation.y = clock.getElapsedTime() * 0.012;
  });

  return (
    <group position={position}>
      <mesh ref={body} rotation={[0.35, 0, 0.2]}>
        <sphereGeometry args={[radius, 96, 96]} />
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
