
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Wallet, Calendar, Mail, IndianRupee } from 'lucide-react';
import WithdrawalModal from './WithdrawalModal';
import { calculatePendingWithdrawals } from '@/utils/paymentUtils';
import { useToast } from '@/hooks/use-toast';

interface ProfileSidebarProps {
  userData: any;
  balance: number;
  onLogout: () => void;
}

const ProfileSidebar = ({ userData, balance, onLogout }: ProfileSidebarProps) => {
  const { toast } = useToast();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  
  const userName = userData?.user_metadata?.name || 
                   userData?.email?.split('@')[0] || 
                   'User';
  
  const userEmail = userData?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();
  
  // Format the created_at date nicely
  const createdAt = userData?.created_at 
    ? new Date(userData.created_at).toLocaleDateString() 
    : 'Unknown';
    
  // Load pending withdrawals only once when component mounts
  useEffect(() => {
    if (userData?.id) {
      const loadPendingWithdrawals = async () => {
        try {
          setIsLoadingPending(true);
          const amount = await calculatePendingWithdrawals(userData.id);
          setPendingWithdrawals(amount);
        } catch (error) {
          console.error("Error loading pending withdrawals:", error);
          toast({
            title: "Couldn't load pending withdrawals",
            description: "There was an error loading your pending withdrawal information",
            variant: "destructive"
          });
        } finally {
          setIsLoadingPending(false);
        }
      };
      
      loadPendingWithdrawals();
    }
  }, [userData?.id, toast]);
  
  // Calculate available balance
  const availableBalance = Math.max(0, balance - pendingWithdrawals);
  
  return (
    <Card className="glass-card shadow-neumorphic border-pastel-200/50 text-gray-800">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={userData?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-pastel-500/20 text-pastel-700 text-xl">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-gray-800">{userName}</CardTitle>
            <CardDescription className="text-gray-600 flex items-center mt-1">
              <Mail className="h-3 w-3 mr-1" />
              {userEmail}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Member since</p>
              <p className="text-gray-800">{createdAt}</p>
            </div>
          </div>
          
          <Separator className="bg-pastel-200/50" />
          
          <div className="bg-pastel-500/10 p-4 rounded-lg border border-pastel-500/20">
            <div className="flex items-center mb-2">
              <Wallet className="h-5 w-5 text-pastel-700 mr-2" />
              <h3 className="font-medium text-gray-800">Wallet Balance</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              <span className="flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {availableBalance.toFixed(2)}
              </span>
            </p>
            {isLoadingPending ? (
              <p className="text-xs text-gray-600 mt-1">
                Loading withdrawal information...
              </p>
            ) : pendingWithdrawals > 0 ? (
              <p className="text-xs text-gray-600 mt-1">
                <span className="text-amber-600">₹{pendingWithdrawals.toFixed(2)} pending withdrawal</span>
              </p>
            ) : null}
            <p className="text-xs text-gray-600 mt-1 mb-3">Available for withdrawal</p>
            
            <Button 
              onClick={() => setIsWithdrawalModalOpen(true)}
              variant="outline" 
              className="w-full border-pastel-200 bg-pastel-500/10 hover:bg-pastel-500/20 text-pastel-700"
              disabled={availableBalance <= 0}
            >
              Withdraw Funds
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onLogout} variant="outline" className="w-full border-pastel-200 hover:bg-pastel-100 text-gray-700">
          Logout
        </Button>
      </CardFooter>
      
      <WithdrawalModal 
        isOpen={isWithdrawalModalOpen} 
        onClose={() => setIsWithdrawalModalOpen(false)}
        userId={userData?.id}
        balance={availableBalance} 
      />
    </Card>
  );
};

export default ProfileSidebar;
