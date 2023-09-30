import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

import purgecss from 'astro-purgecss';

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    tailwind(),
    purgecss({
      safelist: {
        deep: [/grs/],
      },
    }),
  ],
  build: {
    assets: 'app',
  },
});
