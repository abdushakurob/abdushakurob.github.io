import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // Add Tailwind Typography
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light', 'dark'], // Enable DaisyUI themes
  },
};

export default config;
