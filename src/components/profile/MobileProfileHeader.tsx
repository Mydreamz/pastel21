
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Wallet, IndianRupee, LogOut } from 'lucide-react';

interface MobileProfileHeaderProps {
  userData: any;
  balance: number;
  onLogout: () => void;
}

const MobileProfileHeader = ({ userData, balance, onLogout }: MobileProfileHeaderProps) => {
  const userName = userData?.user_metadata?.name || 
                   userData?.email?.split('@')[0] || 
                   'User';
  const userEmail = userData?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Card className="glass-card shadow-neumorphic border-pastel-200/50 text-gray-800 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={userData?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-pastel-500/20 text-pastel-700 text-xl">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">{userName}</h2>
            <p className="text-gray-600 flex items-center text-sm">
              <Mail className="h-3 w-3 mr-1" />
              {userEmail}
            </p>
          </div>
        </div>
        
        <div className="bg-pastel-500/10 p-4 rounded-lg border border-pastel-500/20 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 text-pastel-700 mr-2" />
              <div>
                <h3 className="font-medium text-gray-800">Wallet Balance</h3>
                <p className="text-2xl font-bold text-gray-800 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {balance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onLogout} 
          variant="outline" 
          className="w-full border-pastel-200 hover:bg-pastel-100 text-gray-700"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );
};

export default MobileProfileHeader;
