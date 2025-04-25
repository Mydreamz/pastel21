
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Wallet } from 'lucide-react';
import Logo from '@/components/ui/logo';

interface ProfileSidebarProps {
  userData: any;
  balance: number;
  onLogout: () => void;
}

const ProfileSidebar = ({ userData, balance, onLogout }: ProfileSidebarProps) => {
  const userName = userData?.user_metadata?.name || 
                   userData?.email?.split('@')[0] || 
                   'User';
  
  const userEmail = userData?.email || '';
  
  // Format the created_at date nicely
  const createdAt = userData?.created_at 
    ? new Date(userData.created_at).toLocaleDateString() 
    : 'Unknown';
  
  return (
    <Card className="glass-card border-white/10 text-white">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <User className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <CardTitle>{userName}</CardTitle>
            <CardDescription className="text-gray-400">{userEmail}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Member since</p>
            <p>{createdAt}</p>
          </div>
          
          <Separator className="bg-white/10" />
          
          <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
            <div className="flex items-center mb-2">
              <Wallet className="h-5 w-5 text-emerald-500 mr-2" />
              <h3 className="font-medium">Wallet Balance</h3>
            </div>
            <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onLogout} variant="outline" className="w-full border-white/10 hover:bg-white/10">
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSidebar;
