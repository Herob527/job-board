// @ts-check

import node from "@astrojs/node";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  output: "server",

  adapter: node({
      mode: "standalone",
    }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [preact()],
});