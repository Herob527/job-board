// @ts-check

import node from "@astrojs/node";
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  output: "server",

  adapter: node({
    mode: "standalone",
  }),
  env: {
    schema: {
      DATABASE_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      TOKEN_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [preact()],
});
