
import React from 'react';
import NavigationItem from './mobile/NavigationItem';
import { useNavigationLogic } from './mobile/useNavigationLogic';

interface MobileBottomNavProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
  onDashboardTabChange?: (tab: string) => void;
  activeDashboardTab?: string;
}

const MobileBottomNav = ({ 
  openAuthDialog, 
  onDashboardTabChange,
  activeDashboardTab 
}: MobileBottomNavProps) => {
  const { navigation, isActive } = useNavigationLogic({
    openAuthDialog,
    onDashboardTabChange,
    activeDashboardTab
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center py-2 px-2 safe-area-inset-bottom">
        {navigation.map((item) => (
          <NavigationItem
            key={item.name}
            item={item}
            isActive={isActive(item)}
          />
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
