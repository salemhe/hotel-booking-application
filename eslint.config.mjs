// eslint.config.mjs
import next from "eslint-config-next";

export default [
  // Base Next.js rules (TypeScript + React)
  ...next(),

  // Ignore build output and deps
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
      ".vercel/**",
    ],
  },

  // Project-level rule overrides
  {
    rules: {
      // Allow <img> if you intentionally don't want next/image somewhere
      "@next/next/no-img-element": "off",
      // Feel free to extend with your preferences:
      // "react/jsx-key": "error",
      // "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
