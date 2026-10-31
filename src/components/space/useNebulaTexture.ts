"use client";

import { useLayoutEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { NOISE_GLSL } from "./noiseGlsl";

/**
 * Bakes a deep-space nebula into a texture ONCE on the GPU.
 *
 * Why bake instead of running the shader every frame? A nebula needs ~20
 * noise lookups per pixel. Doing that for every pixel, 60 times a second,
 * would melt a phone. Rendering it a single time into a texture and then
 * just *displaying* that texture costs almost nothing per frame. The same
 * texture is also turned into an environment map, so shiny surfaces reflect
 * the actual nebula, which is a big part of why the result feels real.
 *
 * The picture is computed from a 3D direction (not a flat 2D coordinate), so
 * it wraps around the sky sphere with no visible seam.
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  varying vec2 vUv;
  ${NOISE_GLSL}
  void main() {
    float phi = vUv.x * 6.2831853;
    float lat = (vUv.y - 0.5) * 3.14159265;
    vec3 d = vec3(cos(lat) * cos(phi), sin(lat), cos(lat) * sin(phi));

    // Domain warping: bend the noise lookup with other noise, which gives the
    // wispy, flowing filaments real nebulae have.
    vec3 q = vec3(fbm(d * 2.0),
                  fbm(d * 2.0 + vec3(5.2, 1.3, 2.8)),
                  fbm(d * 2.0 + vec3(2.7, 8.1, 4.4)));
    float n = fbm(d * 2.6 + 2.3 * q);

    // A bright diagonal band, like the plane of a galaxy.
    vec3 axis = normalize(vec3(0.35, 0.82, 0.45));
    float band = exp(-pow(dot(d, axis) * 2.4, 2.0));

    float density = pow(n, 3.0) * (0.05 + 1.9 * band);

    // Dark dust lanes cut across the glow.
    float dust = fbm(d * 5.5 + q * 1.6);
    density *= mix(1.0, smoothstep(0.32, 0.68, dust), 0.85);

    float t = fbm(d * 1.5 + q);
    // Colour grading by palette: cool teal and indigo for most of the gas,
    // a touch of violet, and amber only in the hottest cores. Teal against
    // amber is the classic cinematic "teal and orange" contrast.
    vec3 deepTeal = vec3(0.02, 0.13, 0.27);
    vec3 indigo   = vec3(0.16, 0.14, 0.52);
    vec3 teal     = vec3(0.04, 0.46, 0.56);
    vec3 hotCore  = vec3(1.00, 0.62, 0.24);
    vec3 col = mix(deepTeal, indigo, smoothstep(0.25, 0.75, t));
    col = mix(col, teal, smoothstep(0.52, 0.82, fbm(d * 3.1 + q)) * 0.55);
    col = mix(col, hotCore, smoothstep(0.5, 0.95, n * band * 1.9));
    col *= density * 1.55;

    // Faint unresolved starlight haze along the band, plus a near-black base.
    col += vec3(0.55, 0.6, 0.8) * pow(band, 2.0) * 0.06 * fbm(d * 40.0);
    col += vec3(0.002, 0.003, 0.008);

    // Write LINEAR colour. The render target is flagged sRGB, so the GPU encodes
    // it on write and three.js decodes it on read. Applying pow(1/2.2) here as
    // well would encode twice, lifting everything into a washed-out haze.
    gl_FragColor = vec4(col, 1.0);
  }
`;

export interface Nebula {
  texture: THREE.Texture;
  env: THREE.Texture | null;
}

export function useNebulaTexture(width = 2048): Nebula | null {
  const gl = useThree((s) => s.gl);
  const [nebula, setNebula] = useState<Nebula | null>(null);

  useLayoutEffect(() => {
    const height = width / 2;
    const rt = new THREE.WebGLRenderTarget(width, height, {
      type: THREE.UnsignedByteType,
      colorSpace: THREE.SRGBColorSpace,
      depthBuffer: false,
    });
    const mat = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    const scene = new THREE.Scene();
    scene.add(quad);
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const prev = gl.getRenderTarget();
    gl.setRenderTarget(rt);
    gl.render(scene, cam);
    gl.setRenderTarget(prev);

    rt.texture.mapping = THREE.EquirectangularReflectionMapping;

    let env: THREE.Texture | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    try {
      pmrem = new THREE.PMREMGenerator(gl);
      env = pmrem.fromEquirectangular(rt.texture).texture;
    } catch {
      env = null; // reflections are a bonus; the sky still works without them
    }

    setNebula({ texture: rt.texture, env });

    return () => {
      rt.dispose();
      mat.dispose();
      quad.geometry.dispose();
      pmrem?.dispose();
      env?.dispose();
    };
  }, [gl, width]);

  return nebula;
}
