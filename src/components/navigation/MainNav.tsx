
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard, Shield, LogOut } from 'lucide-react';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 backdrop-blur-lg backdrop-filter bg-white/80">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Mobile: Only logo and company name in center */}
        <div className="flex items-center md:justify-start justify-center w-full md:w-auto">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center group">
            <div className="h-8 w-8 mr-3 relative">
              <Shield className="absolute inset-0 text-pastel-600 h-full w-full group-hover:text-pastel-700 transition-colors" />
            </div>
            <span className="text-2xl font-bold text-gray-900 font-display">
              Monitize<span className="text-pastel-600">.club</span>
            </span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center">
          {!isAuthenticated && (
            <NavigationMenu className="flex items-center ml-10">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="text-gray-700 hover:text-pastel-700 transition-colors px-4 py-2 font-medium">
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-gray-700 hover:text-pastel-700 transition-colors px-4 py-2 cursor-pointer font-medium"
                    onClick={() => scrollToSection('features')}
                  >
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-gray-700 hover:text-pastel-700 transition-colors px-4 py-2 cursor-pointer font-medium"
                    onClick={() => scrollToSection('pricing')}
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/marketplace" className="text-gray-700 hover:text-pastel-700 transition-colors px-4 py-2 font-medium">
                    Marketplace
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        
        {/* Desktop user actions */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated && user ? <>
              <NotificationDropdown />
              
              <Button onClick={() => navigate('/create')} className="hidden md:flex">
                Create Content
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative h-9 w-9 rounded-full p-0">
                    <User className="h-5 w-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border border-gray-200 shadow-elevated">
                  <div className="px-3 py-3 border-b border-gray-200">
                    <p className="font-medium text-gray-900 truncate">{userName}</p>
                    <p className="text-sm text-gray-600 truncate">{userEmail}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer hover:bg-gray-50 py-2">
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-gray-50 py-2">
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/create')} className="cursor-pointer hover:bg-gray-50 py-2 md:hidden">
                    Create Content
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 py-2">
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </> : <>
              <Button variant="outline" onClick={() => openAuthDialog('login')} className="text-sm">
                Sign In
              </Button>
              <Button onClick={() => openAuthDialog('signup')} className="text-sm">
                Sign Up
              </Button>
            </>}
        </div>
      </div>
    </header>
  );
};

export default MainNav;
