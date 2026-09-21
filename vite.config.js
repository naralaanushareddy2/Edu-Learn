import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@data": fileURLToPath(new URL("./data", import.meta.url))
    }
  },

  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("jspdf") || id.includes("html2canvas")) {
              return "pdf-vendor";
            }
            if (id.includes("react-icons")) {
              return "icons-vendor";
            }
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom") ||
              id.includes("@reduxjs") ||
              id.includes("react-redux")
            ) {
              return "react-vendor";
            }
            return "vendor";
          }
        }
      }
    }
  }
});