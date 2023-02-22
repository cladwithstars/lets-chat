import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProduction = process.env.NODE_ENV === "production";

const target = isProduction
  ? "https://lets-chat.herokuapp.com"
  : "http://localhost:3000";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": {
        target,
        ws: true,
      },
      "/api": {
        target,
      },
    },
  },
});
