import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone Node CLI tool, not part of the app bundle - CommonJS is
    // appropriate here since it wraps a CJS-only package (fbx2gltf).
    "scripts/**",
  ]),
  // react-three-fiber code deliberately mutates three.js objects (camera,
  // scene, materials, refs) inside useFrame/effects every frame - that is its
  // programming model, and re-rendering React per frame would be far slower.
  // The newer React-Compiler lint rules flag that pattern, so they are turned
  // off for the 3D folders only; the rest of the app keeps them.
  {
    files: ["src/components/scene/**", "src/components/space/**", "src/components/intro/**"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
