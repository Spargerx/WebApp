import { create } from 'zustand';
import { useEffect, useRef } from 'react';
import { useMMKVString } from 'react-native-mmkv';

export type ThemeMode = 'dark' | 'light';

interface ThemeColors {
  // Backgrounds
  bg: string;
  bgCard: string;
  bgCardHover: string;
  bgModal: string;
  bgInput: string;
  bgTabBar: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;

  // Borders
  border: string;
  borderLight: string;

  // Accents
  accent: string;
  accentSoft: string;
  accentGlow: string;

  // Status bar
  statusBar: string;
}

export const themes: Record<ThemeMode, ThemeColors> = {
  dark: {
    bg: '#0A0A0F',
    bgCard: '#141420',
    bgCardHover: '#1A1A2E',
    bgModal: '#141420',
    bgInput: '#1E1E30',
    bgTabBar: 'rgba(20, 20, 32, 0.95)',

    text: '#EEEEF0',
    textSecondary: '#A0A0B0',
    textMuted: '#606070',

    border: '#252538',
    borderLight: 'rgba(255,255,255,0.06)',

    accent: '#6C5CE7',
    accentSoft: 'rgba(108, 92, 231, 0.15)',
    accentGlow: 'rgba(108, 92, 231, 0.08)',

    statusBar: '#0A0A0F',
  },
  light: {
    bg: '#F5F5FA',
    bgCard: '#FFFFFF',
    bgCardHover: '#F0F0F8',
    bgModal: '#FFFFFF',
    bgInput: '#F0F0F5',
    bgTabBar: 'rgba(255, 255, 255, 0.95)',

    text: '#1A1A2E',
    textSecondary: '#6B6B80',
    textMuted: '#9B9BB0',

    border: '#E5E5ED',
    borderLight: 'rgba(0,0,0,0.05)',

    accent: '#6C5CE7',
    accentSoft: 'rgba(108, 92, 231, 0.10)',
    accentGlow: 'rgba(108, 92, 231, 0.06)',

    statusBar: '#F5F5FA',
  },
};

// Gradient-like color palette for app icons
export const APP_COLORS = [
  '#6C5CE7', // Purple
  '#00B894', // Emerald
  '#E17055', // Coral
  '#0984E3', // Ocean Blue
  '#FDCB6E', // Sunflower
  '#E84393', // Pink
  '#00CEC9', // Teal
  '#FF7675', // Salmon
  '#A29BFE', // Lavender
  '#55EFC4', // Mint
];

interface ThemeStore {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()((set) => ({
  mode: 'dark',
  colors: themes.dark,
  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === 'dark' ? 'light' : 'dark';
      return { mode: newMode, colors: themes[newMode] };
    }),
  setTheme: (mode) => set({ mode, colors: themes[mode] }),
}));

// Hook to sync theme with MMKV
export function useHydrateTheme() {
  const [storedTheme, setStoredTheme] = useMMKVString('theme-mode');
  const { mode, setTheme } = useThemeStore();
  const hydrated = useRef(false);

  // On mount: load saved theme from MMKV
  useEffect(() => {
    if (!hydrated.current && storedTheme) {
      setTheme(storedTheme as ThemeMode);
    }
    hydrated.current = true;
  }, []);

  // Persist theme changes to MMKV after hydration
  useEffect(() => {
    if (hydrated.current && storedTheme !== mode) {
      setStoredTheme(mode);
    }
  }, [mode]);
}

