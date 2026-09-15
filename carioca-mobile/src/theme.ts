/**
 * Paleta "neon arcade" para uso desde JS (gradientes, SVG, sombras) donde
 * las clases de NativeWind no alcanzan. Mismos valores que tailwind.config.js
 * (y que carioca-fe/src/index.css en oklch) — si se retocan los tokens,
 * replicar el cambio en los tres lugares.
 */
export const colors = {
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
    grad2: '#de2a00',
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
} as const

/** Pares de degrade para <LinearGradient>, uno por variante de Button. */
export const gradients = {
  primary: [colors.primary[600], colors.pink[500]] as const,
  danger: [colors.danger[600], colors.danger.grad2] as const,
  warning: [colors.warning[500], colors.warning[600]] as const,
  accent: [colors.accent[600], colors.pink[500]] as const,
  cardBack: [colors.felt[700], colors.felt[900]] as const,
}

export const fonts = {
  displayMedium: 'Unbounded_500Medium',
  displaySemibold: 'Unbounded_600SemiBold',
  displayBold: 'Unbounded_700Bold',
  displayExtrabold: 'Unbounded_800ExtraBold',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemibold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
}

/**
 * Aproximación de ".neon-text" (degrade con background-clip:text en web).
 * RN no soporta gradient-clip-text sin @react-native-masked-view/masked-view;
 * en vez de sumar esa dependencia para un detalle decorativo, usamos rosa
 * sólido + glow vía text-shadow.
 */
export const neonTitleStyle = {
  color: colors.pink[500],
  textShadowColor: 'rgba(224,72,184,0.45)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 12,
} as const
