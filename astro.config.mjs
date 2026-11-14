// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: replace with your real Netlify URL (or custom domain) after the first deploy.
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
