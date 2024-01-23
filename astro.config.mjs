import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import webmanifest from "astro-webmanifest";

// https://astro.build/config
export default defineConfig({
  site: 'https://tessae.github.io',
  base: '/astro_grow',
  integrations: [
    react(),
    webmanifest({
      short_name: "Grow",
      name: "Grow: a personal seed sowing database",
      icon: "public/favicon.svg",
      start_url: "/astro_grow/?source=pwa",
      background_color: "#bad7c1",
      display: "minimal-ui",
      scope: "/astro_grow/",
      theme_color: "#393756",
      description: "Providing information about when to sow seeds"
    })
  ],
});