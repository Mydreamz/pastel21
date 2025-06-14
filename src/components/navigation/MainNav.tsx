import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Search, User, LogOut, Settings, DollarSign, FileText, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';

interface MainNavProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const MainNav = ({ openAuthDialog }: MainNavProps) => {
  const { user, session, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    ...(session ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <nav className="nav-glass sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-high-contrast neon-glow"
          >
            <span className="text-gradient-pastel">Monitize</span>
            <span>.club</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`transition-colors duration-200 hover:text-gradient-pastel neon-glow ${
                    location.pathname === item.href
                      ? 'text-gradient-pastel font-medium'
                      : 'text-medium-contrast'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {!isMobile && session && (
              <Button
                onClick={() => navigate('/search')}
                variant="ghost"
                size="icon"
                className="glass-button hover-glow"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="glass-button hover-glow"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="modal-glass border-0 backdrop-blur-xl">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <FileText className="mr-2 h-4 w-4" />
                    My Content
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="light:bg-gray-200 dark:bg-white/20" />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  onClick={() => openAuthDialog('login')} 
                  variant="ghost"
                  className="glass-button hover-glow"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => openAuthDialog('signup')}
                  className="app-button"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="glass-button hover-glow"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 modal-glass rounded-lg mt-2 mx-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-4 py-2 transition-colors duration-200 hover:text-gradient-pastel neon-glow ${
                  location.pathname === item.href
                    ? 'text-gradient-pastel font-medium'
                    : 'text-medium-contrast'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {!session && (
              <div className="px-4 py-2 space-y-2">
                <Button 
                  onClick={() => {
                    openAuthDialog('login');
                    setMobileMenuOpen(false);
                  }} 
                  variant="ghost"
                  className="w-full glass-button hover-glow"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    openAuthDialog('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full app-button"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
