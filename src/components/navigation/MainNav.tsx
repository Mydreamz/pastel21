
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard, Shield, LogOut } from 'lucide-react';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu';

type MainNavProps = {
  openAuthDialog: (tab: 'login' | 'signup') => void;
};

const MainNav = ({
  openAuthDialog
}: MainNavProps) => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const isAuthenticated = !!session;
  const isMobile = useIsMobile();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  
  // Function to scroll to section when using hash links
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 backdrop-blur-lg backdrop-filter bg-background/80 dark:bg-glass-dark dark:border-glass-border">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center group">
            <div className="h-8 w-8 mr-3 relative">
              <Shield className="absolute inset-0 text-primary h-full w-full group-hover:text-primary/80 transition-colors dark:text-neon-blue dark:group-hover:text-neon-blue/80" />
            </div>
            <span className="text-2xl font-bold text-foreground font-display">
              Monitize<span className="text-primary dark:text-neon-blue">.club</span>
            </span>
          </Link>
          
          {/* Hide desktop navigation on mobile and for guest users on non-home pages */}
          {!isMobile && !isAuthenticated && (
            <NavigationMenu className="hidden md:flex items-center ml-10">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="text-foreground hover:text-primary transition-colors px-4 py-2 font-medium dark:hover:text-neon-blue">
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-foreground hover:text-primary transition-colors px-4 py-2 cursor-pointer font-medium dark:hover:text-neon-blue"
                    onClick={() => scrollToSection('features')}
                  >
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-foreground hover:text-primary transition-colors px-4 py-2 cursor-pointer font-medium dark:hover:text-neon-blue"
                    onClick={() => scrollToSection('pricing')}
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors px-4 py-2 font-medium dark:hover:text-neon-blue">
                    Marketplace
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        
        {/* Hide auth buttons on mobile to keep header clean */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          {isAuthenticated && user ? <>
              {!isMobile && <NotificationDropdown />}
              
              {!isMobile && (
                <Button onClick={() => navigate('/create')} className="hidden md:flex">
                  Create Content
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative h-9 w-9 rounded-full p-0">
                    <User className="h-5 w-5 text-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-lg border border-border shadow-elevated dark:bg-glass-dark dark:backdrop-blur-xl dark:border-glass-border dark:shadow-glass">
                  <div className="px-3 py-3 border-b border-border dark:border-glass-border">
                    <p className="font-medium text-foreground truncate">{userName}</p>
                    <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer hover:bg-accent py-2 dark:hover:bg-glass-light">
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-accent py-2 dark:hover:bg-glass-light">
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {isMobile && (
                    <DropdownMenuItem onClick={() => navigate('/create')} className="cursor-pointer hover:bg-accent py-2 dark:hover:bg-glass-light">
                      Create Content
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive py-2">
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </> : <>
              {!isMobile && (
                <>
                  <Button variant="outline" onClick={() => openAuthDialog('login')} className="text-sm">
                    Sign In
                  </Button>
                  <Button onClick={() => openAuthDialog('signup')} className="text-sm">
                    Sign Up
                  </Button>
                </>
              )}
            </>}
        </div>
      </div>
    </header>
  );
};

export default MainNav;
