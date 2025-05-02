
import { useState, useEffect, createContext, useContext } from 'react';

type ThemeContextType = {
  theme: 'light';
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useState<'light'>('light');

  useEffect(() => {
    // Apply light theme to document
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    
    // Save theme preference
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
