
import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useState<Theme>('light'); // Always light theme

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes and ensure light theme
    root.classList.remove('light', 'dark');
    root.classList.add('light');
    
    // Remove dark theme from localStorage
    localStorage.removeItem('theme');
  }, []);

  const toggleTheme = () => {
    // Do nothing - no theme switching
  };

  const setTheme = () => {
    // Do nothing - always light theme
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
