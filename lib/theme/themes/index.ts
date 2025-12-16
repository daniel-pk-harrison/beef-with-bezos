// Theme Registry - All themes exported here
import { Theme } from '../types';
import { standardThemes, rageTheme } from './standard';
import { unhingedThemes } from './unhinged';

// All themes combined
export const allThemes: Theme[] = [...standardThemes, ...unhingedThemes];

// Theme lookup map
export const themeMap: Record<string, Theme> = Object.fromEntries(
  allThemes.map((theme) => [theme.id, theme])
);

// Get theme by ID with fallback
export function getTheme(id: string): Theme {
  return themeMap[id] ?? rageTheme;
}

// Get themes by category
export function getThemesByCategory(category: 'standard' | 'unhinged'): Theme[] {
  return allThemes.filter((theme) => theme.category === category);
}

// Default theme
export const defaultTheme = rageTheme;

// Re-export individual themes for convenience
export * from './standard';
export * from './unhinged';
