
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentDistributionService } from '@/services/PaymentDistributionService';
import { EarningsSummary as EarningsSummaryType } from '@/types/transaction';
import { Loader2, IndianRupee, CreditCard, Wallet, WalletCards } from 'lucide-react';

interface EarningsSummaryProps {
  userId: string;
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({ userId }) => {
  const [earnings, setEarnings] = useState<EarningsSummaryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const summary = await PaymentDistributionService.getCreatorEarningsSummary(userId);
        setEarnings(summary);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEarnings();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card className="shadow-neumorphic border-pastel-200/50">
        <CardContent className="pt-6 flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-pastel-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-neumorphic border-pastel-200/50">
      <CardHeader>
        <CardTitle className="text-gray-800">Earnings Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-pastel-500/10 p-4 rounded-lg border border-pastel-500/20">
            <div className="flex items-center mb-2">
              <WalletCards className="h-5 w-5 text-pastel-700 mr-2" />
              <h3 className="font-medium text-gray-800">Total Earnings</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800 flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              {earnings?.total_earnings.toFixed(2) || "0.00"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Lifetime earnings (after platform fees)
            </p>
          </div>
          
          <div className="bg-pastel-500/10 p-4 rounded-lg border border-pastel-500/20">
            <div className="flex items-center mb-2">
              <Wallet className="h-5 w-5 text-pastel-700 mr-2" />
              <h3 className="font-medium text-gray-800">Available Balance</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800 flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              {earnings?.available_balance.toFixed(2) || "0.00"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Ready for withdrawal
            </p>
          </div>
          
          <div className="bg-pastel-500/10 p-4 rounded-lg border border-pastel-500/20">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-pastel-700 mr-2" />
              <h3 className="font-medium text-gray-800">Pending Withdrawals</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800 flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              {earnings?.pending_withdrawals.toFixed(2) || "0.00"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Being processed
            </p>
          </div>
          
          <div className="bg-pastel-500/10 p-4 rounded-lg border border-pastel-500/20">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-pastel-700 mr-2" />
              <h3 className="font-medium text-gray-800">Total Transactions</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {earnings?.total_transactions || "0"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Successful sales
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsSummary;
