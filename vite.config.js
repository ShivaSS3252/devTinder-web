import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/", // you're deploying at the root, so this is correct
  plugins: [react()],
});
