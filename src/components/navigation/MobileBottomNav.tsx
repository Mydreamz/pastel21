
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, User, FileText, DollarSign, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileBottomNavProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  show: boolean;
  action?: () => void;
}

const MobileBottomNav = ({ openAuthDialog }: MobileBottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const isAuthenticated = !!session;

  // Navigation for authenticated users - 4 main tabs
  const authenticatedNavigation: NavigationItem[] = [
    {
      name: 'My Content',
      href: '/dashboard?tab=my-content',
      icon: FileText,
      show: true,
    },
    {
      name: 'Purchased',
      href: '/dashboard?tab=purchased',
      icon: DollarSign,
      show: true,
    },
    {
      name: 'Marketplace',
      href: '/marketplace',
      icon: Store,
      show: true,
    },
    {
      name: 'Create',
      href: '/create',
      icon: Plus,
      show: true,
    },
  ];

  // Navigation for guest users
  const guestNavigation: NavigationItem[] = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      show: true,
    },
    {
      name: 'Marketplace',
      href: '/marketplace',
      icon: Store,
      show: true,
    },
    {
      name: 'Sign In',
      href: '#',
      icon: User,
      show: true,
      action: () => openAuthDialog('login'),
    },
  ];

  const navigation = isAuthenticated ? authenticatedNavigation : guestNavigation;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/dashboard?tab=my-content') {
      return location.pathname === '/dashboard' && (!location.search || location.search.includes('tab=my-content'));
    }
    if (path === '/dashboard?tab=purchased') {
      return location.pathname === '/dashboard' && location.search.includes('tab=purchased');
    }
    if (path.startsWith('/dashboard')) {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (item: NavigationItem) => {
    if (item.action) {
      item.action();
    } else {
      navigate(item.href);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 block md:hidden">
      <div className="flex justify-around items-center py-2 px-2 safe-area-inset-bottom">
        {navigation.map((item) => {
          if (!item.show) return null;

          const isItemActive = isActive(item.href);

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className="flex-1 flex flex-col items-center py-2 px-1 min-w-0 touch-manipulation"
            >
              <item.icon 
                className={`h-5 w-5 mb-1 ${
                  isItemActive 
                    ? 'text-pastel-600' 
                    : 'text-gray-500'
                }`} 
              />
              <span 
                className={`text-xs truncate max-w-full ${
                  isItemActive 
                    ? 'text-pastel-600 font-medium' 
                    : 'text-gray-500'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
