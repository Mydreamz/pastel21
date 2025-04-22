
import React from 'react';
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

const Profile = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    userData, 
    userContents, 
    balance, 
    handleLogout, 
    handleEditContent, 
    handleDeleteContent 
  } = useProfileData();

  if (!isAuthenticated || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors">
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
            <Card className="glass-card border-white/10 text-white">
              <CardHeader>
                <CardTitle>Your Dashboard</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your content and view analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="analytics">
                  <TabsList className="grid grid-cols-3 bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                      <BarChart className="h-4 w-4 mr-2" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="content" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      Your Content
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
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
