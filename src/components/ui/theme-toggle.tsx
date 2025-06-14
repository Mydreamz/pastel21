
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full bg-background/20 backdrop-blur-xl border border-border/50 hover:bg-background/30 hover:border-border/70 transition-all duration-300 hover:shadow-glow"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-foreground transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-foreground transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
