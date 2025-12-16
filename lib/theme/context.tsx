'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Theme, ThemeContextType, ColorMode } from './types';
import { allThemes, getTheme, defaultTheme } from './themes';

const THEME_STORAGE_KEY = 'beef-theme';
const COLOR_MODE_STORAGE_KEY = 'beef-color-mode';

// Create context with undefined initial value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to safely access localStorage
function getStoredValue(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage might be full or disabled
  }
}

// Apply theme CSS variables to document
function applyThemeToDocument(theme: Theme, colorMode: ColorMode) {
  const root = document.documentElement;

  // Set data attributes
  root.dataset.theme = theme.id;
  root.dataset.colorMode = colorMode;

  // Apply CSS variables
  const { colors, effects } = theme;

  // Core colors
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--foreground', colors.foreground);

  // Primary palette
  Object.entries(colors.primary).forEach(([shade, value]) => {
    root.style.setProperty(`--primary-${shade}`, value);
  });

  // Other colors
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--accent-foreground', colors.accentForeground);
  root.style.setProperty('--surface', colors.surface);
  root.style.setProperty('--surface-hover', colors.surfaceHover);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--border-hover', colors.borderHover);
  root.style.setProperty('--text-primary', colors.textPrimary);
  root.style.setProperty('--text-secondary', colors.textSecondary);
  root.style.setProperty('--text-muted', colors.textMuted);
  root.style.setProperty('--glow', colors.glow);
  root.style.setProperty('--gradient-start', colors.gradientStart);
  root.style.setProperty('--gradient-middle', colors.gradientMiddle);
  root.style.setProperty('--gradient-end', colors.gradientEnd);

  // Effects
  root.style.setProperty('--gradient-speed', `${effects.gradientSpeed}s`);
  root.style.setProperty(
    '--glow-intensity',
    `${effects.counterGlowIntensity * 30}px`
  );
  root.style.setProperty('--hue-rotate', `${effects.hueRotate}deg`);
  root.style.setProperty('--saturate', `${effects.saturate}`);
  root.style.setProperty('--brightness', `${effects.brightness}`);
  root.style.setProperty('--contrast', `${effects.contrast}`);

  // Toggle effect classes on body
  const body = document.body;
  const effectClasses = [
    'effect-animated-gradient',
    'effect-scanlines',
    'effect-glitch',
    'effect-neon',
    'effect-rainbow',
    'effect-spiral',
    'effect-matrix',
    'effect-halftone',
    'effect-fire',
    'effect-float',
    'effect-chromatic',
    'effect-vhs',
    'effect-hue-rotate',
    'effect-3d',
  ];

  // Remove all effect classes
  effectClasses.forEach((cls) => body.classList.remove(cls));

  // Add active effect classes
  if (effects.animatedGradient) body.classList.add('effect-animated-gradient');
  if (effects.scanlines) body.classList.add('effect-scanlines');
  if (effects.glitch) body.classList.add('effect-glitch');
  if (effects.neonGlow) body.classList.add('effect-neon');
  if (effects.rainbow) body.classList.add('effect-rainbow');
  if (effects.spiral) body.classList.add('effect-spiral');
  if (effects.matrixRain) body.classList.add('effect-matrix');
  if (effects.halftone) body.classList.add('effect-halftone');
  if (effects.fireEffect) body.classList.add('effect-fire');
  if (effects.floatEffect) body.classList.add('effect-float');
  if (effects.chromaticAberration) body.classList.add('effect-chromatic');
  if (effects.vhsEffect) body.classList.add('effect-vhs');
  if (effects.hueRotateAnimation) body.classList.add('effect-hue-rotate');
  if (effects.perspective) body.classList.add('effect-3d');

  // Set light/dark mode class
  root.classList.remove('light', 'dark');
  root.classList.add(colorMode);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultThemeId?: string;
}

export function ThemeProvider({
  children,
  defaultThemeId = 'rage',
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState(defaultThemeId);
  const [colorModeOverride, setColorModeOverride] = useState<ColorMode | null>(
    null
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Get current theme
  const theme = useMemo(() => getTheme(themeId), [themeId]);

  // Effective color mode (theme default or override)
  const colorMode = colorModeOverride ?? theme.colorMode;

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedTheme = getStoredValue(THEME_STORAGE_KEY);
    const storedColorMode = getStoredValue(
      COLOR_MODE_STORAGE_KEY
    ) as ColorMode | null;

    if (storedTheme && getTheme(storedTheme)) {
      setThemeId(storedTheme);
    }
    if (storedColorMode === 'light' || storedColorMode === 'dark') {
      setColorModeOverride(storedColorMode);
    }

    setIsHydrated(true);
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (isHydrated) {
      applyThemeToDocument(theme, colorMode);
    }
  }, [theme, colorMode, isHydrated]);

  // Theme setter with persistence
  const setTheme = useCallback((newThemeId: string) => {
    const newTheme = getTheme(newThemeId);
    setThemeId(newThemeId);
    setColorModeOverride(null); // Reset color mode override when switching themes
    setStoredValue(THEME_STORAGE_KEY, newThemeId);
    localStorage.removeItem(COLOR_MODE_STORAGE_KEY);
  }, []);

  // Color mode toggle
  const toggleColorMode = useCallback(() => {
    const newMode = colorMode === 'dark' ? 'light' : 'dark';
    setColorModeOverride(newMode);
    setStoredValue(COLOR_MODE_STORAGE_KEY, newMode);
  }, [colorMode]);

  const contextValue: ThemeContextType = useMemo(
    () => ({
      theme,
      themeId,
      setTheme,
      colorMode,
      toggleColorMode,
      availableThemes: allThemes,
      isHydrated,
    }),
    [theme, themeId, setTheme, colorMode, toggleColorMode, isHydrated]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
