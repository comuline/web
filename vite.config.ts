import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [preact()],
  build: {
    outDir: ".dist",
    sourcemap: "hidden",
    minify: true,
  },
});
