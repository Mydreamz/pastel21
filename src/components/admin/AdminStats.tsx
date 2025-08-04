import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  totalRevenue: string;
  totalViews: number;
  totalTransactions: number;
  pendingWithdrawals: string;
}

const AdminStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalContent: 0,
    totalRevenue: '0.00',
    totalViews: 0,
    totalTransactions: 0,
    pendingWithdrawals: '0.00'
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('admin-dashboard-data', {
        body: { action: 'get-stats' },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-auth')}`
        }
      });

      if (error) throw error;
      
      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      value: `₹${stats.totalRevenue}`,
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
      value: `₹${stats.pendingWithdrawals}`,
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