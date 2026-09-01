// @ts-check

import node from "@astrojs/node";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

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
    resolve: {
      alias: {
        react: "preact/compat",
        "react-dom": "preact/compat",
      },
    },
  },

  integrations: [preact()],
});
