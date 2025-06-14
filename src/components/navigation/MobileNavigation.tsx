
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
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-pastel-200/50 px-4 py-2 md:hidden">
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => openAuthDialog('login')}
            className="flex-1 border-pastel-200 hover:bg-pastel-100"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => openAuthDialog('signup')}
            className="flex-1 bg-pastel-500 hover:bg-pastel-600 text-white"
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-pastel-200/50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[44px] ${
                item.isActive
                  ? 'text-pastel-600 bg-pastel-100'
                  : 'text-gray-600 hover:text-pastel-600 hover:bg-pastel-50'
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
