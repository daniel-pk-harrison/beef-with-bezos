'use client';

import { useThemeContext } from './context';
import { Theme, ThemeColors, ThemeEffects, ThemeAnimations } from './types';

// Main hook to access theme
export function useTheme() {
  const context = useThemeContext();
  return context;
}

// Hook to get just the current theme
export function useCurrentTheme(): Theme {
  const { theme } = useThemeContext();
  return theme;
}

// Hook to get theme colors
export function useThemeColors(): ThemeColors {
  const { theme } = useThemeContext();
  return theme.colors;
}

// Hook to get theme effects
export function useThemeEffects(): ThemeEffects {
  const { theme } = useThemeContext();
  return theme.effects;
}

// Hook to get theme animations config
export function useThemeAnimations(): ThemeAnimations {
  const { theme } = useThemeContext();
  return theme.animations;
}

// Hook to check if an effect is active
export function useThemeEffect(
  effectName: keyof ThemeEffects
): boolean | string | number {
  const { theme } = useThemeContext();
  return theme.effects[effectName];
}

// Hook to get theme-specific taglines
export function useThemeTaglines(missCount: number): string[] {
  const { theme } = useThemeContext();
  const taglines = theme.taglines;

  if (!taglines) return [];

  if (missCount === 0) return taglines.zero ?? [];
  if (missCount === 1) return taglines.one ?? [];
  if (missCount <= 4) return taglines.few ?? [];
  if (missCount <= 9) return taglines.several ?? [];
  return taglines.many ?? [];
}

// Hook to check if we're on a chaotic theme
export function useIsChaotic(): boolean {
  const { theme } = useThemeContext();
  return theme.category === 'unhinged';
}

// Hook to get Framer Motion spring config from theme
export function useThemeSpring() {
  const { theme } = useThemeContext();
  const { stiffness, damping, mass } = theme.animations;

  return {
    type: 'spring' as const,
    stiffness,
    damping,
    mass,
  };
}

// Hook to get hover animation config
export function useHoverAnimation() {
  const { theme } = useThemeContext();
  const { hoverScale, wobble, bounce } = theme.animations;

  return {
    scale: hoverScale,
    rotate: wobble ? [0, -2, 2, -2, 0] : 0,
    y: bounce ? -5 : 0,
  };
}
