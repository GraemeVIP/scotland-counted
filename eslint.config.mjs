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
    /*
     * Git worktrees live in .claude, and a worktree is a whole second copy of
     * this repository, build output included. Without this, linting from the
     * main checkout reports warnings from minified chunks inside a worktree,
     * which are not source and are not anybody's to fix. The house style tests
     * needed the same exclusion for the same reason.
     */
    ".claude/**",
    // Playwright's own output.
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
