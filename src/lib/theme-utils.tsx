import * as React from 'react';

// Simplified ThemeContext that always uses light mode
type ThemeContextType = {
  isDarkMode: boolean; // Always false but kept for API compatibility
  toggleTheme: () => void; // No-op function
};

// Create context with light mode values
export const ThemeContext = React.createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Theme provider component - simplified to only provide light mode
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always ensure light mode is applied
  React.useEffect(() => {
    // Remove any dark mode classes
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.classList.add('light-mode');
    
    // Set CSS variables for light mode
    document.documentElement.style.setProperty('--sidebar-bg', 'hsl(var(--sidebar-bg-light))');
    document.documentElement.style.setProperty('--sidebar-text', 'hsl(var(--sidebar-text-light))');
  }, []);

  // Provide context values - always light mode
  const contextValue = React.useMemo(
    () => ({
      isDarkMode: false,
      toggleTheme: () => {}, // No-op function since we don't allow toggling anymore
    }),
    []
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme - simplified
export function useTheme() {
  return React.useContext(ThemeContext);
}
