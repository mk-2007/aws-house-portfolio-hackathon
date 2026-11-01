"use client";

import { useLayoutEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { NOISE_GLSL } from "./noiseGlsl";
import { bakeEquirect } from "./bakeEquirect";

/**
 * The planet's surface, baked once: colour in RGB (ocean, land, clouds) and a
 * "city lights" mask in the alpha channel. The planet shader then only does a
 * texture lookup plus lighting each frame, instead of ~150 noise evaluations
 * per pixel, which is what was making the intro slow.
 */
const fragment = /* glsl */ `
  varying vec2 vUv;
  ${NOISE_GLSL}
  void main() {
    float phi = vUv.x * 6.2831853;
    float lat = (vUv.y - 0.5) * 3.14159265;
    vec3 p = vec3(cos(lat) * cos(phi), sin(lat), cos(lat) * sin(phi));

    float land = fbm(p * 2.6 + vec3(3.0));
    float coast = smoothstep(0.50, 0.535, land);
    vec3 ocean = mix(vec3(0.008, 0.045, 0.15), vec3(0.025, 0.14, 0.36), fbm(p * 8.0));
    vec3 ground = mix(vec3(0.14, 0.23, 0.08), vec3(0.50, 0.40, 0.27), smoothstep(0.55, 0.78, land));
    vec3 surf = mix(ocean, ground, coast);

    float cloud = smoothstep(0.50, 0.78, fbm(p * 4.2 + vec3(7.0, 1.0, 3.0)));
    surf = mix(surf, vec3(0.92), cloud * 0.8);

    float city = step(0.80, vnoise(p * 70.0)) * coast * (1.0 - cloud);
    gl_FragColor = vec4(surf, city);
  }
`;

export function usePlanetTexture(): THREE.Texture | null {
  const gl = useThree((s) => s.gl);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useLayoutEffect(() => {
    const rt = bakeEquirect(gl, fragment, 2048);
    setTex(rt.texture);
    return () => rt.dispose();
  }, [gl]);
  return tex;
}
