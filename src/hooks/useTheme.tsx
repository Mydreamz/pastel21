
import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'dark' | 'light';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') as Theme;
    const preferredTheme = savedTheme || 'dark';
    
    setTheme(preferredTheme);
    
    // Apply theme classes to document
    document.documentElement.classList.remove('light', 'dark', 'cream');
    document.documentElement.classList.add(preferredTheme);
    
    // Save theme preference
    localStorage.setItem('theme', preferredTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Apply theme classes to document
    document.documentElement.classList.remove('light', 'dark', 'cream');
    document.documentElement.classList.add(newTheme);
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
