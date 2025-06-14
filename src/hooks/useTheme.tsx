
import { useState, useEffect, createContext, useContext } from 'react';

type ThemeContextType = {
  theme: 'cream';
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cream',
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useState<'cream'>('cream');

  useEffect(() => {
    // Apply cream theme to document
    document.documentElement.classList.add('cream');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.remove('dark');
    
    // Save theme preference
    localStorage.setItem('theme', 'cream');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
