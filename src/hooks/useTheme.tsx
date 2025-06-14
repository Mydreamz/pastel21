
import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark mode

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    
    // Apply theme to document
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark', 'cream');
    
    // Add new theme class
    document.documentElement.classList.add(newTheme);
    
    // Update CSS custom properties for the theme
    if (newTheme === 'dark') {
      document.documentElement.style.setProperty('--background', '210 40% 2%');
      document.documentElement.style.setProperty('--foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--card', '210 40% 4%');
      document.documentElement.style.setProperty('--card-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--popover', '210 40% 4%');
      document.documentElement.style.setProperty('--popover-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--primary', '263 70% 50%');
      document.documentElement.style.setProperty('--primary-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--secondary', '210 40% 8%');
      document.documentElement.style.setProperty('--secondary-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--muted', '210 40% 8%');
      document.documentElement.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
      document.documentElement.style.setProperty('--accent', '210 40% 8%');
      document.documentElement.style.setProperty('--accent-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--border', '210 40% 12%');
      document.documentElement.style.setProperty('--input', '210 40% 12%');
      document.documentElement.style.setProperty('--ring', '263 70% 50%');
    } else {
      // Light theme (cream) properties
      document.documentElement.style.setProperty('--background', '40 30% 96%');
      document.documentElement.style.setProperty('--foreground', '218 11% 15%');
      document.documentElement.style.setProperty('--card', '40 30% 98%');
      document.documentElement.style.setProperty('--card-foreground', '218 11% 15%');
      document.documentElement.style.setProperty('--popover', '40 30% 98%');
      document.documentElement.style.setProperty('--popover-foreground', '218 11% 15%');
      document.documentElement.style.setProperty('--primary', '340 82% 52%');
      document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
      document.documentElement.style.setProperty('--secondary', '40 30% 92%');
      document.documentElement.style.setProperty('--secondary-foreground', '218 11% 15%');
      document.documentElement.style.setProperty('--muted', '40 30% 92%');
      document.documentElement.style.setProperty('--muted-foreground', '218 11% 45%');
      document.documentElement.style.setProperty('--accent', '340 82% 92%');
      document.documentElement.style.setProperty('--accent-foreground', '218 11% 15%');
      document.documentElement.style.setProperty('--border', '220 13% 91%');
      document.documentElement.style.setProperty('--input', '220 13% 91%');
      document.documentElement.style.setProperty('--ring', '340 82% 52%');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
