import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Shield, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminStats from '@/components/admin/AdminStats';
import TransactionHistory from '@/components/admin/TransactionHistory';
import UserManagement from '@/components/admin/UserManagement';
import ContentManagement from '@/components/admin/ContentManagement';
import WithdrawalManagement from '@/components/admin/WithdrawalManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdminAuthenticated, adminLogout } = useAdminAuth();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login to access admin dashboard",
        variant: "destructive"
      });
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate, toast]);

  const handleLogout = () => {
    adminLogout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/admin/login');
  };

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto py-8 px-4">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-2 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto bg-card border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            <TransactionHistory />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <ContentManagement />
          </TabsContent>
          
          <TabsContent value="withdrawals" className="space-y-6">
            <WithdrawalManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
