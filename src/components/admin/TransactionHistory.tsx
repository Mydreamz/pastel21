import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: string;
  platform_fee: string;
  creator_earnings: string;
  payment_status: string;
  timestamp: string;
  razorpay_payment_id: string;
  payment_method: string;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('is_deleted', false)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
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
      'completed': { variant: 'default' as const, label: 'Completed' },
      'pending': { variant: 'secondary' as const, label: 'Pending' },
      'failed': { variant: 'destructive' as const, label: 'Failed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const exportToCsv = () => {
    if (transactions.length === 0) return;
    
    const headers = ['Payment ID', 'Amount', 'Platform Fee', 'Creator Earnings', 'Status', 'Method', 'Date'];
    const csvRows = [
      headers.join(','),
      ...transactions.map(txn => [
        txn.razorpay_payment_id || 'N/A',
        txn.amount,
        txn.platform_fee,
        txn.creator_earnings,
        txn.payment_status,
        txn.payment_method || 'N/A',
        formatDate(txn.timestamp)
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Transaction History</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTransactions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCsv}
            disabled={transactions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Payment ID</TableHead>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Platform Fee</TableHead>
                  <TableHead className="text-muted-foreground">Creator Earnings</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Method</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm text-foreground">
                      {transaction.razorpay_payment_id?.substring(0, 12) || 'N/A'}...
                    </TableCell>
                    <TableCell className="text-foreground">₹{transaction.amount}</TableCell>
                    <TableCell className="text-foreground">₹{transaction.platform_fee}</TableCell>
                    <TableCell className="text-foreground">₹{transaction.creator_earnings}</TableCell>
                    <TableCell>{getStatusBadge(transaction.payment_status)}</TableCell>
                    <TableCell className="text-foreground">{transaction.payment_method || 'N/A'}</TableCell>
                    <TableCell className="text-foreground">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;