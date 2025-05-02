
import React from 'react';
import { IndianRupee, MessageSquare, TrendingUp } from 'lucide-react';

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="glass-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-800">₹12,582</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-pastel-600" />
              <p className="text-xs text-pastel-600">+24% from last month</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-pastel-500/20 flex items-center justify-center">
            <IndianRupee className="h-5 w-5 text-pastel-600" />
          </div>
        </div>
      </div>
      
      <div className="glass-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Messages</p>
            <p className="text-2xl font-bold text-gray-800">8,429</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-pastel-600" />
              <p className="text-xs text-pastel-600">+18% from last month</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-pastel-500/20 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-pastel-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
