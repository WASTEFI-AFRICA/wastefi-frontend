import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Reported but not blocking. Replacing the remaining `any` types is tracked as
      // cleanup, and the warnings keep them visible meanwhile.
      "@typescript-eslint/no-explicit-any": "warn",
      // These React Compiler checks flag patterns that work today (Date.now() in a
      // component body, setState in an effect). They are real smells, so they stay
      // as warnings to fix, not build blockers.
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
