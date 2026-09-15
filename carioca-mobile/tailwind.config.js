/** @type {import('tailwindcss').Config} */
// Paleta "neon arcade" — mismos valores que carioca-fe/src/index.css (oklch),
// convertidos a hex porque NativeWind/RN necesitan colores estáticos resolubles.
// Si se retocan los tokens en carioca-fe, replicar el cambio acá y en src/theme.ts.
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        felt: {
          900: '#05050b',
          800: '#0e0e18',
          700: '#161721',
          600: '#393b52',
          500: '#535461',
          400: '#787986',
          300: '#a2a3b1',
        },
        primary: {
          300: '#d9a3ff',
          400: '#b97df7',
          500: '#a167f1',
          600: '#8851eb',
          700: '#703dc6',
        },
        success: {
          400: '#28d6df',
          600: '#00c8d1',
          700: '#00a7b1',
        },
        danger: {
          300: '#ff8880',
          400: '#ff645f',
          600: '#fc4447',
          700: '#de1d3f',
        },
        warning: {
          200: '#f7e2b8',
          300: '#f2c86c',
          400: '#edb417',
          500: '#eba000',
          600: '#e58300',
          700: '#cb5c00',
        },
        accent: {
          400: '#e068d8',
          600: '#bd4bd6',
          700: '#a32ebb',
        },
        neutral: {
          300: '#9c9dab',
          400: '#787986',
          500: '#535461',
          600: '#272833',
          700: '#191a24',
        },
        pink: {
          400: '#f269cb',
          500: '#e048b8',
          600: '#c72da2',
        },
        card: {
          red: '#d02a3a',
          black: '#161616',
        },
      },
      fontFamily: {
        // Unbounded (display) — un peso por clase, RN no sintetiza negrita de fuentes custom.
        'display-medium': ['Unbounded_500Medium'],
        'display-semibold': ['Unbounded_600SemiBold'],
        'display-bold': ['Unbounded_700Bold'],
        'display-extrabold': ['Unbounded_800ExtraBold'],
        // Manrope (body)
        body: ['Manrope_400Regular'],
        'body-medium': ['Manrope_500Medium'],
        'body-semibold': ['Manrope_600SemiBold'],
        'body-bold': ['Manrope_700Bold'],
      },
    },
  },
  plugins: [],
}
