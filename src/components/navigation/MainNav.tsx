import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard, Shield } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-lg backdrop-filter">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 mr-2 relative">
              <Shield className="absolute inset-0 text-pastel-500 h-full w-full animate-pulse-gentle" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Monitize<span className="text-pastel-500">.club</span>
            </span>
          </Link>
          
          {!isAuthenticated && (
            <NavigationMenu className="hidden md:flex items-center ml-10">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="text-gray-700 hover:text-pastel-700 transition-colors px-4 py-2">
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-gray-700 hover:text-pastel-700 transition-colors px-4 py-2 cursor-pointer"
                    onClick={() => scrollToSection('features')}
                  >
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-gray-700 hover:text-pastel-700 transition-colors px-4 py-2 cursor-pointer"
                    onClick={() => scrollToSection('pricing')}
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/#contents" className="text-gray-700 hover:text-pastel-700 transition-colors px-4 py-2">
                    Explore
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? <>
              <NotificationDropdown />
              
              <Button onClick={() => navigate('/create')} className="hidden md:flex bg-pastel-500 hover:bg-pastel-600 text-white">
                Create Content
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative h-9 w-9 rounded-full bg-white/5 border-pastel-200 hover:bg-pastel-100/50 p-0">
                    <User className="h-5 w-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border border-pastel-100 text-gray-700">
                  <div className="px-3 py-2">
                    <p className="font-medium text-gray-800">{userName}</p>
                    <p className="text-sm text-gray-600">{userEmail}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-pastel-200/50" />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer hover:bg-pastel-100">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-pastel-100">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/create')} className="cursor-pointer hover:bg-pastel-100 md:hidden">
                    Create Content
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-pastel-200/50" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#7FB069] hover:bg-green-50 hover:text-[#6A9A56]">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </> : <>
              <Button variant="outline" onClick={() => openAuthDialog('login')} className="border-pastel-200 hover:border-pastel-500 hover:bg-pastel-100 text-gray-700">
                Sign In
              </Button>
              <Button onClick={() => openAuthDialog('signup')} className="bg-pastel-500 hover:bg-pastel-600 text-white">
                Sign Up
              </Button>
            </>}
        </div>
      </div>
    </header>
  );
};

export default MainNav;
