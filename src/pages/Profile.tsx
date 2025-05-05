
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, FileText, BarChart } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import UserContentsList from '@/components/profile/UserContentsList';
import AccountSettings from '@/components/profile/AccountSettings';
import AnalyticsDashboard from '@/components/profile/AnalyticsDashboard';
import EarningsSummary from '@/components/profile/EarningsSummary';

const Profile = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    userData, 
    userContents, 
    balance,
    fetchUserData, 
    handleLogout, 
    handleEditContent, 
    handleDeleteContent 
  } = useProfileData();

  useEffect(() => {
    // Force refresh user data when the profile page loads
    if (isAuthenticated && userData) {
      fetchUserData();
    }
  }, [isAuthenticated, userData, fetchUserData]);

  if (!isAuthenticated || !userData) {
    return null;
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileSidebar 
              userData={userData} 
              balance={balance} 
              onLogout={handleLogout}
            />
          </div>
          
          <div className="lg:col-span-2">
            <Card className="glass-card shadow-neumorphic border-pastel-200/50 text-gray-800 mb-6">
              <CardContent className="pt-6">
                <EarningsSummary userId={userData.id} />
              </CardContent>
            </Card>
            
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
