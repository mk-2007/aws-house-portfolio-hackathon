import * as THREE from "three";

/**
 * Renders a fragment shader ONCE into an equirectangular texture.
 *
 * "Baking" moves expensive per-pixel work from every frame (60x a second) to a
 * single moment at load. The finished picture is then just a texture lookup,
 * which is close to free. The shader receives `vUv` (0..1 across the image).
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export function bakeEquirect(gl: THREE.WebGLRenderer, fragment: string, width: number): THREE.WebGLRenderTarget {
  const rt = new THREE.WebGLRenderTarget(width, width / 2, {
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

  mat.dispose();
  quad.geometry.dispose();
  return rt;
}
