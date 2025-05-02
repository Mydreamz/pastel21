
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard, Shield } from 'lucide-react';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useAuth } from '@/App';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

type MainNavProps = {
  openAuthDialog: (tab: 'login' | 'signup') => void;
};

const MainNav = ({
  openAuthDialog
}: MainNavProps) => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = !!session;
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  
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
            <nav className="hidden md:flex items-center space-x-6 ml-10">
              <Link to="/" className="text-gray-600 hover:text-pastel-700 transition-colors">
                Home
              </Link>
              <Link to="/#features" className="text-gray-600 hover:text-pastel-700 transition-colors">
                Features
              </Link>
              <Link to="/#pricing" className="text-gray-600 hover:text-pastel-700 transition-colors">
                Pricing
              </Link>
              <Link to="/#contents" className="text-gray-600 hover:text-pastel-700 transition-colors">
                Explore
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center mr-2">
            <Sun className="h-4 w-4 text-gray-600 mr-1" />
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme}
            />
            <Moon className="h-4 w-4 text-gray-600 ml-1" />
          </div>
          
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
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-500">{userEmail}</p>
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
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600">
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
