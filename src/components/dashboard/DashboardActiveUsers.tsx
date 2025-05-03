
import React from 'react';
import { Users } from 'lucide-react';

const DashboardActiveUsers = () => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pastel-500/20 flex items-center justify-center">
            <Users className="h-4 w-4 text-pastel-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">Active Users</p>
            <p className="text-xs text-black/70">Last 30 days</p>
          </div>
        </div>
        <p className="text-lg font-bold text-black">3,892</p>
      </div>
    </div>
  );
};

export default DashboardActiveUsers;
