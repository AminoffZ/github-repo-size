import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://aminoffz.github.io',
  base: '/github-repo-size',
  build: {
    assets: 'app',
  },
  outDir:'github-repo-size',
});
