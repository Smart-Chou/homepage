import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://marxchou.com",
  output: "static",
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
