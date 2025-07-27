import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WithdrawalRequest {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  upi_id: string;
}

const WithdrawalHistory = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWithdrawalRequests();
    }
  }, [user]);

  const fetchWithdrawalRequests = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch withdrawal history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'secondary' as const, label: 'Pending' },
      'processing': { variant: 'default' as const, label: 'Processing' },
      'completed': { variant: 'default' as const, label: 'Completed' },
      'rejected': { variant: 'destructive' as const, label: 'Rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = {
      'bank': { variant: 'outline' as const, label: 'Bank Transfer' },
      'upi': { variant: 'secondary' as const, label: 'UPI' }
    };
    
    const config = methodConfig[method as keyof typeof methodConfig] || methodConfig.bank;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return 'N/A';
    const visible = accountNumber.slice(-4);
    return `****${visible}`;
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Clock className="h-5 w-5" />
          Withdrawal History
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchWithdrawalRequests}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Method</TableHead>
                  <TableHead className="text-muted-foreground">Account/UPI</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Requested</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-foreground font-medium">
                      ₹{request.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodBadge(request.payment_method)}
                    </TableCell>
                    <TableCell className="text-foreground font-mono text-sm">
                      {request.payment_method === 'upi' 
                        ? request.upi_id 
                        : maskAccountNumber(request.account_number)
                      }
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatDate(request.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No withdrawal requests found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WithdrawalHistory;