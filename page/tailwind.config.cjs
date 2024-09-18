import forms from '@tailwindcss/forms';
import catppuccin from '@catppuccin/tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /bg-.+/,
    },
    'mocha',
    'macchiato',
    'frappe',
    'latte',
  ],
  plugins: [
    forms,
    catppuccin({
      prefix: 'ctp',
      defaultFlavour: 'macchiato',
    }),
  ],
};
