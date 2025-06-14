
import { Home, Plus, User, Store, FileText, DollarSign } from 'lucide-react';

export interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  show: boolean;
  action?: () => void;
  isDashboardTab?: boolean;
  tabValue?: string;
}

export const createDashboardNavigation = (
  onDashboardTabChange?: (tab: string) => void
): NavigationItem[] => [
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

export const createAuthenticatedNavigation = (): NavigationItem[] => [
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

export const createGuestNavigation = (
  openAuthDialog: (tab: 'login' | 'signup') => void
): NavigationItem[] => [
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
