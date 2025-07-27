import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  FileText, 
  IndianRupee, 
  TrendingUp,
  Eye,
  CreditCard
} from 'lucide-react';

interface StatsData {
  totalUsers: number;
  totalContent: number;
  totalRevenue: number;
  totalViews: number;
  totalTransactions: number;
  pendingWithdrawals: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalContent: 0,
    totalRevenue: 0,
    totalViews: 0,
    totalTransactions: 0,
    pendingWithdrawals: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total content count
      const { count: contentCount } = await supabase
        .from('contents')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false);

      // Get total revenue from platform fees
      const { data: platformFees } = await supabase
        .from('platform_fees')
        .select('amount')
        .eq('is_deleted', false);

      const totalRevenue = platformFees?.reduce((sum, fee) => 
        sum + parseFloat(fee.amount || '0'), 0) || 0;

      // Get total views
      const { count: viewsCount } = await supabase
        .from('content_views')
        .select('*', { count: 'exact', head: true });

      // Get total transactions
      const { count: transactionsCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false);

      // Get pending withdrawals
      const { data: withdrawals } = await supabase
        .from('withdrawal_requests')
        .select('amount')
        .in('status', ['pending', 'processing']);

      const pendingWithdrawals = withdrawals?.reduce((sum, withdrawal) => 
        sum + Number(withdrawal.amount), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalContent: contentCount || 0,
        totalRevenue,
        totalViews: viewsCount || 0,
        totalTransactions: transactionsCount || 0,
        pendingWithdrawals
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Total Content',
      value: stats.totalContent.toLocaleString(),
      icon: FileText,
      color: 'text-green-500'
    },
    {
      title: 'Platform Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: IndianRupee,
      color: 'text-yellow-500'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-500'
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toLocaleString(),
      icon: CreditCard,
      color: 'text-orange-500'
    },
    {
      title: 'Pending Withdrawals',
      value: `₹${stats.pendingWithdrawals.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;