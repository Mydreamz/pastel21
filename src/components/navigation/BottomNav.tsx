
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid3x3, Plus, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface BottomNavProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const BottomNav = ({ openAuthDialog }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, session } = useAuth();
  const isAuthenticated = !!session;

  const handleCreateClick = () => {
    if (isAuthenticated) {
      navigate('/create');
    } else {
      openAuthDialog('signup');
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      openAuthDialog('login');
    }
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      action: () => navigate('/'),
      isActive: location.pathname === '/',
    },
    {
      icon: Grid3x3,
      label: 'Explore',
      action: () => scrollToSection('contents'),
      isActive: location.hash === '#contents',
    },
    {
      icon: Plus,
      label: 'Create',
      action: handleCreateClick,
      isActive: location.pathname === '/create',
      highlight: true,
    },
    {
      icon: Search,
      label: 'Search',
      action: () => navigate('/search'),
      isActive: location.pathname === '/search',
    },
    {
      icon: User,
      label: 'Profile',
      action: handleProfileClick,
      isActive: location.pathname === '/profile',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-border">
      <div className="safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                onClick={item.action}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 touch-target ${
                  item.highlight
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : item.isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${item.highlight ? 'h-6 w-6' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
