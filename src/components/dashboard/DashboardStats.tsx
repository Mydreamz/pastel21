
import React from 'react';
import { IndianRupee, MessageSquare, TrendingUp } from 'lucide-react';
import { useProfileData } from '@/hooks/profile/useProfileData';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardStats = () => {
  const { profileData, isLoading } = useProfileData();

  const totalEarnings = profileData?.total_earnings
    ? parseFloat(profileData.total_earnings)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="glass-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-high-contrast text-sm mb-1">Total Earnings</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-high-contrast">₹{totalEarnings.toFixed(2)}</p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <p className="text-xs text-primary">+24% from last month</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <IndianRupee className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
      
      <div className="glass-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-high-contrast text-sm mb-1">Total Messages</p>
            <p className="text-2xl font-bold text-high-contrast">8,429</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <p className="text-xs text-primary">+18% from last month</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
