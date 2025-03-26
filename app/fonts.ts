import localFont from 'next/font/local';

export const satoshi = localFont({
  src: '../public/fonts/Satoshi-Variable.woff2',
  variable: '--font-satoshi',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
});

export const plusJakarta = localFont({
  src: '../public/fonts/PlusJakartaSans-Variable.woff2',
  variable: '--font-plus-jakarta',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
});

export const jetbrainsMono = localFont({
  src: '../public/fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
}); 