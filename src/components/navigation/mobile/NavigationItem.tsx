
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem as NavigationItemType } from './navigationConfig';

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ item, isActive }) => {
  if (!item.show) return null;

  const content = (
    <div className="flex flex-col items-center py-2 px-1 min-w-0">
      <item.icon 
        className={`h-5 w-5 ${
          isActive 
            ? 'text-pastel-600' 
            : 'text-gray-500'
        }`} 
      />
      <span 
        className={`text-xs mt-1 truncate max-w-full ${
          isActive 
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
        to={item.href}
        className="flex-1 flex justify-center min-w-0"
      >
        {content}
      </Link>
    );
  }

  return null;
};

export default NavigationItem;
