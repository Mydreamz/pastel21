
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Wallet, FileText, Edit, Trash2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import StarsBackground from '@/components/StarsBackground';
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userContents, setUserContents] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const parsedAuth = JSON.parse(auth);
          if (parsedAuth && parsedAuth.user) {
            setIsAuthenticated(true);
            setUserData(parsedAuth.user);
            
            // Get user contents
            const contents = JSON.parse(localStorage.getItem('contents') || '[]');
            const userContents = contents.filter((content: any) => content.creatorId === parsedAuth.user.id);
            setUserContents(userContents);
            
            // Calculate balance from unlocked content
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const userEarnings = transactions
              .filter((tx: any) => tx.creatorId === parsedAuth.user.id)
              .reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0);
            
            setBalance(userEarnings);
          } else {
            redirectToHome();
          }
        } catch (e) {
          console.error("Auth parsing error", e);
          redirectToHome();
        }
      } else {
        redirectToHome();
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const redirectToHome = () => {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive"
    });
    navigate('/');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('auth');
    toast({
      title: "Logged out successfully"
    });
    navigate('/');
  };
  
  const handleEditContent = (contentId: string) => {
    navigate(`/edit/${contentId}`);
  };
  
  const handleDeleteContent = (contentId: string) => {
    try {
      const contents = JSON.parse(localStorage.getItem('contents') || '[]');
      const updatedContents = contents.filter((content: any) => content.id !== contentId);
      localStorage.setItem('contents', JSON.stringify(updatedContents));
      
      setUserContents(prevContents => prevContents.filter(content => content.id !== contentId));
      
      toast({
        title: "Content deleted",
        description: "Your content has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Delete failed",
        description: "An error occurred while deleting your content.",
        variant: "destructive"
      });
    }
  };
  
  if (!isAuthenticated || !userData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      {/* Background elements */}
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-white/10 text-white">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle>{userData.name}</CardTitle>
                    <CardDescription className="text-gray-400">{userData.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Member since</p>
                    <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
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
                <Button onClick={handleLogout} variant="outline" className="w-full border-white/10 hover:bg-white/10">
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/10 text-white">
              <CardHeader>
                <CardTitle>Your Dashboard</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your content and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content">
                  <TabsList className="grid grid-cols-2 bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="content" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      Your Content
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                      <User className="h-4 w-4 mr-2" />
                      Account Settings
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Your Published Content</h3>
                      <Button onClick={() => navigate('/create')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm">
                        Create New
                      </Button>
                    </div>
                    
                    {userContents.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
                        <p>You haven't created any content yet</p>
                        <Button onClick={() => navigate('/create')} variant="link" className="text-emerald-500 mt-2">
                          Create your first content
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userContents.map((content) => (
                          <div key={content.id} className="p-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{content.title}</h4>
                              <p className="text-sm text-gray-400">${parseFloat(content.price).toFixed(2)} • Created {new Date(content.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={() => handleEditContent(content.id)} variant="outline" size="sm" className="border-white/10 hover:bg-white/10">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => handleDeleteContent(content.id)} variant="outline" size="sm" className="border-white/10 hover:bg-white/10 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="settings" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Name</label>
                        <Input value={userData.name} className="bg-white/5 border-white/10 text-white" readOnly />
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Email</label>
                        <Input value={userData.email} className="bg-white/5 border-white/10 text-white" readOnly />
                      </div>
                      
                      <div className="pt-4">
                        <Button variant="outline" className="w-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
                          Update Profile
                        </Button>
                      </div>
                    </div>
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
