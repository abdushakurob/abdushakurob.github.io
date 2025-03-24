import type { Config } from 'tailwindcss';

interface ExtendedConfig {
  daisyui?: {
    themes: string[];
  };
}

const config: Config & ExtendedConfig = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-source-sans)", "sans-serif"],
      }
    },
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
