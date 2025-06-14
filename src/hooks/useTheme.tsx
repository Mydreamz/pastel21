
import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark' | 'cream' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark' | 'cream';
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cream',
  setTheme: () => {},
  effectiveTheme: 'cream',
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('cream');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark' | 'cream'>('cream');

  useEffect(() => {
    // Get saved theme preference or default to cream
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const updateEffectiveTheme = () => {
      let newEffectiveTheme: 'light' | 'dark' | 'cream' = 'cream';
      
      if (theme === 'system') {
        newEffectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newEffectiveTheme = theme;
      }
      
      setEffectiveTheme(newEffectiveTheme);
      
      // Apply theme classes to document
      document.documentElement.classList.remove('light', 'dark', 'cream');
      document.documentElement.classList.add(newEffectiveTheme);
      
      // Save theme preference
      localStorage.setItem('theme', theme);
    };

    updateEffectiveTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateEffectiveTheme);

    return () => mediaQuery.removeEventListener('change', updateEffectiveTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
