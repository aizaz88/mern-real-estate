import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "https://mern-real-estate-backend-nine.vercel.app/api": {
        target: "http://localhost:5000",
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
