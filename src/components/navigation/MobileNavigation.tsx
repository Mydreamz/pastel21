
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Plus, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const MobileNavigation = () => {
  const location = useLocation();
  const { session } = useAuth();
  
  if (!session) return null;

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      active: location.pathname === '/'
    },
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      icon: Plus,
      label: 'Create',
      path: '/create',
      active: location.pathname === '/create'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      active: location.pathname === '/profile'
    }
  ];

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'mobile-nav-item',
                item.active && 'active'
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
