// Theme System Type Definitions

export type ColorMode = 'light' | 'dark';

export type AnimationIntensity = 'normal' | 'intense' | 'chaos' | 'reduced';

export type ThemeCategory = 'standard' | 'unhinged';

// Color palette structure
export interface ThemeColors {
  // Core colors
  background: string;
  foreground: string;

  // Primary palette (11 shades)
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };

  // Secondary accent
  accent: string;
  accentForeground: string;

  // Surface colors
  surface: string;
  surfaceHover: string;

  // Border colors
  border: string;
  borderHover: string;

  // Text hierarchy
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Special colors
  glow: string;

  // Gradient colors
  gradientStart: string;
  gradientMiddle: string;
  gradientEnd: string;
}

// Visual effects configuration
export interface ThemeEffects {
  // Background effects
  animatedGradient: boolean;
  gradientSpeed: number; // seconds

  // Counter effects
  counterGlow: boolean;
  counterGlowIntensity: number; // 0-1
  counterShake: boolean;

  // Special visual effects
  scanlines: boolean;
  glitch: boolean;
  neonGlow: boolean;
  rainbow: boolean;
  spiral: boolean;
  matrixRain: boolean;
  halftone: boolean;
  fireEffect: boolean;
  floatEffect: boolean;
  chromaticAberration: boolean;
  vhsEffect: boolean;

  // Particles
  particles: 'none' | 'confetti' | 'fire' | 'matrix' | 'stars' | 'sparkles';

  // CSS Filters
  hueRotate: number; // degrees, 0 = no rotation
  hueRotateAnimation: boolean;
  saturate: number; // 1 = normal
  brightness: number; // 1 = normal
  contrast: number; // 1 = normal
  blur: number; // px

  // 3D effects
  perspective: boolean;
  card3D: boolean;
}

// Font configuration
export interface ThemeFonts {
  heading: string;
  body: string;
  mono: string;
}

// Animation configuration for Framer Motion
export interface ThemeAnimations {
  // Spring physics
  stiffness: number;
  damping: number;
  mass: number;

  // Timing
  duration: number;

  // Hover effects
  hoverScale: number;

  // Special animations
  wobble: boolean;
  bounce: boolean;
  shake: boolean;
  pulse: boolean;
  typewriter: boolean;
}

// Theme-specific taglines
export interface ThemeTaglines {
  zero: string[];
  one: string[];
  few: string[]; // 2-4
  several: string[]; // 5-9
  many: string[]; // 10+
}

// Main Theme interface
export interface Theme {
  // Identity
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: ThemeCategory;

  // Mode
  colorMode: ColorMode;

  // Styling
  colors: ThemeColors;
  effects: ThemeEffects;
  fonts: ThemeFonts;
  animations: ThemeAnimations;

  // Content
  taglines?: Partial<ThemeTaglines>;

  // Special flags
  warningLabel?: string; // e.g., "⚠️ VISUAL CHAOS"
  reducedMotionFallback?: string; // theme id to fall back to
}

// Theme context type
export interface ThemeContextType {
  theme: Theme;
  themeId: string;
  setTheme: (themeId: string) => void;
  colorMode: ColorMode;
  toggleColorMode: () => void;
  availableThemes: Theme[];
  isHydrated: boolean;
}

// Default effect values
export const DEFAULT_EFFECTS: ThemeEffects = {
  animatedGradient: true,
  gradientSpeed: 15,
  counterGlow: true,
  counterGlowIntensity: 0.5,
  counterShake: false,
  scanlines: false,
  glitch: false,
  neonGlow: false,
  rainbow: false,
  spiral: false,
  matrixRain: false,
  halftone: false,
  fireEffect: false,
  floatEffect: false,
  chromaticAberration: false,
  vhsEffect: false,
  particles: 'none',
  hueRotate: 0,
  hueRotateAnimation: false,
  saturate: 1,
  brightness: 1,
  contrast: 1,
  blur: 0,
  perspective: false,
  card3D: false,
};

// Default animation values
export const DEFAULT_ANIMATIONS: ThemeAnimations = {
  stiffness: 400,
  damping: 30,
  mass: 1,
  duration: 0.3,
  hoverScale: 1.05,
  wobble: false,
  bounce: false,
  shake: false,
  pulse: false,
  typewriter: false,
};

// Default fonts
export const DEFAULT_FONTS: ThemeFonts = {
  heading: 'inherit',
  body: 'inherit',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};
