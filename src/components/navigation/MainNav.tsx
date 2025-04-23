
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from 'lucide-react';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useAuth } from '@/App';
import { supabase } from '@/integrations/supabase/client';

type MainNavProps = {
  openAuthDialog: (tab: 'login' | 'signup') => void;
};

const MainNav = ({
  openAuthDialog
}: MainNavProps) => {
  const navigate = useNavigate();
  const {
    user,
    session
  } = useAuth();
  const isAuthenticated = !!session;
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  
  return <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-lg backdrop-filter">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Creator<span className="text-emerald-500">Hub</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 ml-10">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/#contents" className="text-gray-300 hover:text-white transition-colors">
              Explore
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? <>
              <NotificationDropdown />
              
              <Button onClick={() => navigate('/create')} className="hidden md:flex bg-emerald-500 hover:bg-emerald-600 text-white">
                Create Content
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative h-9 w-9 rounded-full bg-white/5 border-white/10 hover:bg-white/10 p-0">
                    <User className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 border border-white/10 text-white">
                  <div className="px-3 py-2">
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-400">{userEmail}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-white/10">
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/create')} className="cursor-pointer hover:bg-white/10 md:hidden">
                    Create Content
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </> : <>
              <Button variant="outline" onClick={() => openAuthDialog('login')} className="border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-white">
                Sign In
              </Button>
              <Button onClick={() => openAuthDialog('signup')} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Sign Up
              </Button>
            </>}
        </div>
      </div>
    </header>;
};

export default MainNav;
