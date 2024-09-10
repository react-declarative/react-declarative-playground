import { defineConfig } from "vite";
import environmentPlugin from "vite-plugin-environment";
import fullReload from "vite-plugin-full-reload";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";
import million from "million/compiler";

export default defineConfig({
  plugins: [
    react(),
    fullReload(["**/*.ts*", "**/*.js*", "**/*.mjs"], {
      always: true,
      root: "src",
    }),
    nodePolyfills({
      protocolImports: true,
    }),
    environmentPlugin("all", { loadEnvFiles: true, prefix: "CC_" }),
    million.vite({
      auto: true,
    }),
  ],
  build: {
    target: "chrome87",
    outDir: "build",
    minify: "terser",
  },
  server: {
    hmr: false,
  },
  optimizeDeps: {
    include: ['@mui/material/Tooltip', '@emotion/styled'],
  },
});
