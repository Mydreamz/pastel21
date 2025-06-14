
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard, Shield, Menu } from 'lucide-react';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  
  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col space-y-4 mt-8">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-lg font-medium hover:text-primary transition-colors text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-lg font-medium hover:text-primary transition-colors text-left"
              >
                Pricing
              </button>
              <Link to="/#contents" className="text-lg font-medium hover:text-primary transition-colors">
                Explore
              </Link>
              <div className="pt-4 space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => openAuthDialog('login')} 
                  className="w-full h-12"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => openAuthDialog('signup')} 
                  className="w-full h-12"
                >
                  Sign Up
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-lg font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/create" className="text-lg font-medium hover:text-primary transition-colors">
                Create Content
              </Link>
              <Link to="/profile" className="text-lg font-medium hover:text-primary transition-colors">
                Profile
              </Link>
              <div className="pt-4 border-t">
                <p className="font-medium text-foreground">{userName}</p>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="mt-3 w-full h-12 text-destructive hover:text-destructive"
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <MobileNav />
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-lora text-xl font-bold">
              Monitize<span className="text-primary">.club</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {!isAuthenticated && (
            <>
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </button>
              <Link to="/#contents" className="text-sm font-medium hover:text-primary transition-colors">
                Explore
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            <>
              <NotificationDropdown />
              
              <Button onClick={() => navigate('/create')} className="hidden md:flex h-9">
                Create Content
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" onClick={() => openAuthDialog('login')}>
                Sign In
              </Button>
              <Button onClick={() => openAuthDialog('signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNav;
