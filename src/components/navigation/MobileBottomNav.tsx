
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, User, Grid3X3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileBottomNavProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const MobileBottomNav = ({ openAuthDialog }: MobileBottomNavProps) => {
  const location = useLocation();
  const { user, session } = useAuth();
  const isAuthenticated = !!session;

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      show: true,
    },
    {
      name: 'Explore',
      href: '/search',
      icon: Search,
      show: true,
    },
    {
      name: 'Create',
      href: '/create',
      icon: Plus,
      show: isAuthenticated,
      action: !isAuthenticated ? () => openAuthDialog('login') : undefined,
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Grid3X3,
      show: isAuthenticated,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      show: isAuthenticated,
      action: !isAuthenticated ? () => openAuthDialog('login') : undefined,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {navigation.map((item) => {
          if (!item.show) return null;

          const content = (
            <div className="flex flex-col items-center py-2 px-3">
              <item.icon 
                className={`h-5 w-5 ${
                  isActive(item.href) 
                    ? 'text-pastel-600' 
                    : 'text-gray-500'
                }`} 
              />
              <span 
                className={`text-xs mt-1 ${
                  isActive(item.href) 
                    ? 'text-pastel-600 font-medium' 
                    : 'text-gray-500'
                }`}
              >
                {item.name}
              </span>
            </div>
          );

          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                className="flex-1 flex justify-center"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex-1 flex justify-center"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
