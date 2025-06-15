
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Wallet, Calendar, Mail, IndianRupee, RefreshCw } from 'lucide-react';

interface ProfileSidebarProps {
  userData: any;
  balance: number;
  onLogout: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const ProfileSidebar = ({ userData, balance, onLogout, onRefresh, isRefreshing }: ProfileSidebarProps) => {
  const userName = userData?.user_metadata?.name || 
                   userData?.email?.split('@')[0] || 
                   'User';
  
  const userEmail = userData?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();
  
  const createdAt = userData?.created_at 
    ? new Date(userData.created_at).toLocaleDateString() 
    : 'Unknown';
    
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-pastel-700 mr-2" />
                <h3 className="font-medium text-gray-800">Wallet Balance</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onRefresh} 
                disabled={isRefreshing}
                className="h-7 w-7"
              >
                <RefreshCw className={`h-4 w-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              <span className="flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {balance.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onLogout} variant="outline" className="w-full border-pastel-200 hover:bg-pastel-100 text-gray-700">
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSidebar;
