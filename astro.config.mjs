// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://johnreyaranton.netlify.app',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
