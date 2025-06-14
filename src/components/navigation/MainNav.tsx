
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard, Shield } from 'lucide-react';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 mr-3 relative">
              <Shield className="absolute inset-0 text-primary h-full w-full" />
            </div>
            <span className="text-2xl font-bold text-foreground font-lora">
              Monitize<span className="text-primary">.club</span>
            </span>
          </Link>
          
          {!isAuthenticated && (
            <NavigationMenu className="hidden md:flex items-center ml-10">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="text-foreground hover:text-primary transition-colors px-4 py-2 font-medium">
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-foreground hover:text-primary transition-colors px-4 py-2 cursor-pointer font-medium"
                    onClick={() => scrollToSection('features')}
                  >
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-foreground hover:text-primary transition-colors px-4 py-2 cursor-pointer font-medium"
                    onClick={() => scrollToSection('pricing')}
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/#contents" className="text-foreground hover:text-primary transition-colors px-4 py-2 font-medium">
                    Explore
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          {isAuthenticated && user ? <>
              <NotificationDropdown />
              
              <Button onClick={() => navigate('/create')} className="hidden md:flex">
                Create Content
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative h-9 w-9 rounded-full p-0">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border border-border">
                  <div className="px-3 py-2">
                    <p className="font-medium text-foreground">{userName}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/create')} className="cursor-pointer md:hidden">
                    Create Content
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </> : <>
              <Button variant="outline" onClick={() => openAuthDialog('login')}>
                Sign In
              </Button>
              <Button onClick={() => openAuthDialog('signup')}>
                Sign Up
              </Button>
            </>}
        </div>
      </div>
    </header>
  );
};

export default MainNav;
