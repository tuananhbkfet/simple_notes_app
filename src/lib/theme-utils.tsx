import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Local storage key for theme preference
const THEME_KEY = 'ant-notes-theme-preference';

// Theme options
export type ThemeMode = 'dark' | 'light' | 'system';

// Theme context type
type ThemeContextType = {
  theme: ThemeMode;
  isDarkMode: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

// Create context with default values
export const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'system',
  isDarkMode: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [theme, setThemeState] = React.useState<ThemeMode>('system');
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Initialize theme from local storage or defaults
  React.useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    setThemeState(savedTheme || 'system');
  }, []);

  // Apply theme based on preference, system, and device type
  React.useEffect(() => {
    const applyTheme = () => {
      let shouldUseDarkMode = false;
      
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // On mobile, use light theme by default for better sidebar visibility
        shouldUseDarkMode = isMobile ? false : prefersDark;
      } else {
        shouldUseDarkMode = theme === 'dark';
      }
      
      setIsDarkMode(shouldUseDarkMode);
      document.documentElement.classList.toggle('dark-mode', shouldUseDarkMode);
      document.documentElement.classList.toggle('light-mode', !shouldUseDarkMode);
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isMobile]);

  // Update theme and save to local storage
  const setTheme = React.useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }, []);

  // Toggle between light and dark
  const toggleTheme = React.useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  // Context value
  const contextValue = React.useMemo(
    () => ({
      theme,
      isDarkMode,
      setTheme,
      toggleTheme,
    }),
    [theme, isDarkMode, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
