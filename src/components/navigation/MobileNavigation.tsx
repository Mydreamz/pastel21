
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, Plus, Search, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

type MobileNavigationProps = {
  openAuthDialog: (tab: 'login' | 'signup') => void;
};

const MobileNavigation = ({ openAuthDialog }: MobileNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const isAuthenticated = !!session;

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-3 md:hidden safe-area-pb">
        <div className="flex items-center justify-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => openAuthDialog('login')}
            className="flex-1 h-12"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => openAuthDialog('signup')}
            className="flex-1 h-12"
          >
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/dashboard',
      isActive: location.pathname === '/dashboard'
    },
    {
      icon: Search,
      label: 'Search',
      path: '/search',
      isActive: location.pathname === '/search'
    },
    {
      icon: Plus,
      label: 'Create',
      path: '/create',
      isActive: location.pathname === '/create'
    },
    {
      icon: LayoutDashboard,
      label: 'Marketplace',
      path: '/marketplace',
      isActive: location.pathname === '/marketplace'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      isActive: location.pathname === '/profile'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors duration-200 min-w-[60px] ${
                item.isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
