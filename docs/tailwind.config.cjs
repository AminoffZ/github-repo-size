/** @type {import('tailwindcss').Config} */
module.exports = {
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
    require('@tailwindcss/forms'),
    require('@catppuccin/tailwindcss')({
      prefix: 'ctp',
      defaultFlavour: 'macchiato',
    }),
  ],
};
