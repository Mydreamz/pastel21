
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Shield } from 'lucide-react';

interface PlatformFee {
  id: string;
  transaction_id: string;
  amount: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [platformFees, setPlatformFees] = useState<PlatformFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Authentication check
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (!isAdmin) {
      toast({
        title: "Authentication required",
        description: "You must be logged in as an admin to view this page",
        variant: "destructive"
      });
      navigate('/admin');
    } else {
      fetchPlatformFees();
    }
  }, [navigate]);

  const fetchPlatformFees = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('platform_fees')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPlatformFees(data);
        
        // Calculate total revenue
        const total = data.reduce((sum, fee) => {
          return sum + parseFloat(fee.amount || '0');
        }, 0);
        
        setTotalRevenue(total);
      }
    } catch (error) {
      console.error('Error fetching platform fees:', error);
      toast({
        title: "Failed to load data",
        description: "Could not fetch platform fee data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin dashboard"
    });
    navigate('/admin');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCsv = () => {
    if (platformFees.length === 0) return;
    
    const headers = ['Transaction ID', 'Amount', 'Date'];
    const csvRows = [
      headers.join(','),
      ...platformFees.map(fee => [
        fee.transaction_id,
        fee.amount,
        formatDate(fee.created_at)
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `platform_fees_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-800 to-pastel-900 text-white">
      <div className="container mx-auto py-8 px-4">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-2 text-pastel-500" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="border-pastel-500 text-pastel-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </header>
        
        <div className="grid gap-6 mb-8">
          <Card className="bg-pastel-800/50 border-pastel-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-pastel-100">Platform Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-pastel-100">₹{totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-pastel-300 mt-1">Total earnings from platform fees</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-pastel-800/50 border-pastel-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl text-pastel-100">Platform Fees</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCsv}
              disabled={platformFees.length === 0}
              className="border-pastel-500 text-pastel-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 rounded-full"></div>
              </div>
            ) : platformFees.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-pastel-700">
                      <TableHead className="text-pastel-300">Transaction ID</TableHead>
                      <TableHead className="text-pastel-300">Amount</TableHead>
                      <TableHead className="text-pastel-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {platformFees.map((fee) => (
                      <TableRow key={fee.id} className="border-pastel-700/50">
                        <TableCell className="text-pastel-200 font-mono">
                          {fee.transaction_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="text-pastel-200">₹{fee.amount}</TableCell>
                        <TableCell className="text-pastel-200">
                          {formatDate(fee.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-pastel-300">
                No platform fees found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
