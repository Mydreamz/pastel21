
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, FileText, BarChart } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import { useProfileData } from '@/hooks/profile/useProfileData';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import MobileProfileHeader from '@/components/profile/MobileProfileHeader';
import UserContentsList from '@/components/profile/UserContentsList';
import AccountSettings from '@/components/profile/AccountSettings';
import AnalyticsDashboard from '@/components/profile/AnalyticsDashboard';
import EarningsSummary from '@/components/profile/EarningsSummary';
import { reconcileUserBalance } from '@/utils/balanceUtils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { 
    isAuthenticated, 
    userData, 
    userContents, 
    balance,
    isLoading,
    fetchUserData, 
    handleLogout, 
    handleEditContent, 
    handleDeleteContent 
  } = useProfileData();

  useEffect(() => {
    // Force refresh user data when the profile page loads
    if (isAuthenticated && userData) {
      console.log("Profile page mounted, refreshing user data including balance");
      
      // First reconcile the user's balance to ensure it's accurate
      if (userData.id) {
        reconcileUserBalance(userData.id).then(result => {
          if (result.success) {
            console.log("Balance reconciliation successful:", result);
            // Now fetch the updated data to refresh the UI
            fetchUserData();
          } else {
            console.error("Balance reconciliation failed:", result.error);
            toast({
              title: "Balance update issue",
              description: "We encountered an issue updating your balance. Try refreshing the page.",
              variant: "destructive"
            });
          }
        });
      }
    }
  }, [isAuthenticated, userData, fetchUserData, toast]);

  // Show loading state while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // If user data is not available, show loading
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative overflow-x-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-700 hover:text-pastel-700 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        {/* Mobile Profile Header - only show on mobile */}
        {isMobile && (
          <MobileProfileHeader 
            userData={userData} 
            balance={balance} 
            onLogout={handleLogout}
          />
        )}
        
        {/* Desktop layout with sidebar */}
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Desktop Sidebar - only show on desktop */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <ProfileSidebar 
                userData={userData} 
                balance={balance} 
                onLogout={handleLogout}
              />
            </div>
          )}
          
          {/* Main content */}
          <div className={isMobile ? 'col-span-1' : 'lg:col-span-2'}>
            {/* Earnings Summary - only show on desktop since mobile header shows wallet */}
            {!isMobile && (
              <Card className="glass-card shadow-neumorphic border-pastel-200/50 text-gray-800 mb-6">
                <CardContent className="pt-6">
                  <EarningsSummary userId={userData.id} />
                </CardContent>
              </Card>
            )}
            
            <Card className="glass-card shadow-neumorphic border-pastel-200/50 text-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-800">Your Dashboard</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your content and view analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="analytics">
                  <TabsList className="grid grid-cols-3 bg-white/50 border border-pastel-200/50 p-1">
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-pastel-500 data-[state=active]:text-white text-gray-700">
                      <BarChart className="h-4 w-4 mr-2" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="content" className="data-[state=active]:bg-pastel-500 data-[state=active]:text-white text-gray-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Your Content
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-pastel-500 data-[state=active]:text-white text-gray-700">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="analytics">
                    <AnalyticsDashboard />
                  </TabsContent>
                  
                  <TabsContent value="content">
                    <UserContentsList 
                      userContents={userContents} 
                      onEditContent={handleEditContent} 
                      onDeleteContent={handleDeleteContent} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <AccountSettings userData={userData} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
