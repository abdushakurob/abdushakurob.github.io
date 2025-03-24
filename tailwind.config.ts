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
        sans: ['var(--font-inter)', 'sans-serif'],
        body: ['var(--font-source-sans)', 'sans-serif'], // Ensure it's used correctly
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), 
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light', 'dark'],
  },
};

export default config;
