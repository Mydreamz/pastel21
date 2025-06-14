
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, User, Store, FileText, DollarSign } from 'lucide-react';
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

  // Get current dashboard tab from URL
  const getDashboardTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') || 'my-content';
  };

  // Check if we're on dashboard page
  const isDashboardPage = location.pathname === '/dashboard';

  // Navigation for authenticated users on dashboard - this is the main mobile app navigation
  const dashboardNavigation: NavigationItem[] = [
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
      name: 'Profile',
      href: '/profile',
      icon: User,
      show: true,
    },
  ];

  // Navigation for authenticated users outside dashboard
  const authenticatedNavigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
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
      name: 'Create',
      href: '/create',
      icon: Plus,
      show: true,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
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

  // Determine which navigation to use
  const getNavigation = () => {
    if (!isAuthenticated) return guestNavigation;
    if (isDashboardPage) return dashboardNavigation;
    return authenticatedNavigation;
  };

  const navigation = getNavigation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' && !location.search;
    }
    if (path.includes('?tab=')) {
      const [basePath, tabParam] = path.split('?tab=');
      if (location.pathname === basePath) {
        const currentTab = getDashboardTab();
        return currentTab === tabParam;
      }
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center py-2 px-2 safe-area-inset-bottom">
        {navigation.map((item) => {
          if (!item.show) return null;

          const content = (
            <div className="flex flex-col items-center py-2 px-2 min-w-0">
              <item.icon 
                className={`h-5 w-5 ${
                  isActive(item.href) 
                    ? 'text-pastel-600' 
                    : 'text-gray-500'
                }`} 
              />
              <span 
                className={`text-xs mt-1 truncate max-w-full ${
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
                className="flex-1 flex justify-center min-w-0"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex-1 flex justify-center min-w-0"
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
