
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, User, Store, FileText, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileBottomNavProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
  // New props for dashboard navigation
  onDashboardTabChange?: (tab: string) => void;
  activeDashboardTab?: string;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  show: boolean;
  action?: () => void;
  isDashboardTab?: boolean;
  tabValue?: string;
}

const MobileBottomNav = ({ 
  openAuthDialog, 
  onDashboardTabChange,
  activeDashboardTab 
}: MobileBottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const isAuthenticated = !!session;

  // Check if we're on dashboard page
  const isDashboardPage = location.pathname === '/dashboard';

  // Navigation for authenticated users on dashboard - this is the main mobile app navigation
  const dashboardNavigation: NavigationItem[] = [
    {
      name: 'My Content',
      icon: FileText,
      show: true,
      isDashboardTab: true,
      tabValue: 'my-content',
      action: () => onDashboardTabChange?.('my-content'),
    },
    {
      name: 'Purchased',
      icon: DollarSign,
      show: true,
      isDashboardTab: true,
      tabValue: 'purchased',
      action: () => onDashboardTabChange?.('purchased'),
    },
    {
      name: 'Create',
      href: '/create',
      icon: Plus,
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
      name: 'Create',
      href: '/create',
      icon: Plus,
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

  const isActive = (item: NavigationItem) => {
    // For dashboard tabs, check against activeDashboardTab
    if (item.isDashboardTab && isDashboardPage) {
      return activeDashboardTab === item.tabValue;
    }
    
    // For regular navigation
    if (item.href) {
      if (item.href === '/') {
        return location.pathname === '/';
      }
      if (item.href === '/dashboard') {
        return location.pathname === '/dashboard';
      }
      return location.pathname === item.href;
    }
    
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center py-2 px-2 safe-area-inset-bottom">
        {navigation.map((item) => {
          if (!item.show) return null;

          const active = isActive(item);

          const content = (
            <div className="flex flex-col items-center py-2 px-1 min-w-0">
              <item.icon 
                className={`h-5 w-5 ${
                  active 
                    ? 'text-pastel-600' 
                    : 'text-gray-500'
                }`} 
              />
              <span 
                className={`text-xs mt-1 truncate max-w-full ${
                  active 
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

          if (item.href) {
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex-1 flex justify-center min-w-0"
              >
                {content}
              </Link>
            );
          }

          return null;
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
