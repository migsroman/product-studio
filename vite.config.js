import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change this to match your GitHub repo name
  // e.g., if your repo is github.com/yourname/product-studio → base: "/product-studio/"
  base: "/product-studio/",
});
