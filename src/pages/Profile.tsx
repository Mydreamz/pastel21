
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Wallet, Edit, LogOut, Lock, Plus, FileEdit, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import StarsBackground from '@/components/StarsBackground';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  balance: number;
  createdAt: string;
}

interface ContentData {
  id: string;
  title: string;
  teaser: string;
  price: number;
  content: string;
  type: 'text' | 'link' | 'image' | 'video' | 'audio' | 'document';
  expiry?: string;
  createdAt: string;
  ownerId: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [userContents, setUserContents] = useState<ContentData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (!userData) {
      // Not logged in, redirect to auth page
      navigate('/auth');
      return;
    }
    
    // Parse user data
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setEditName(parsedUser.name || '');
    setEditEmail(parsedUser.email || '');
    setEditPhone(parsedUser.phone || '');
    
    // Get user's contents
    const allContents = JSON.parse(localStorage.getItem('lockedContents') || '[]');
    const userContents = allContents.filter((content: ContentData) => content.ownerId === parsedUser.id);
    setUserContents(userContents);
  }, [navigate]);
  
  const handleUpdateProfile = () => {
    if (!user) return;
    
    // Update user object
    const updatedUser = {
      ...user,
      name: editName,
      email: editEmail || user.email,
      phone: editPhone || user.phone
    };
    
    // Update in localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: UserData) => 
      u.id === user.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setUser(updatedUser);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    navigate('/auth');
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full mx-auto px-3 py-4 sm:px-4 md:px-6 max-w-xl">
        <button 
          onClick={() => navigate('/')} 
          className="mb-4 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-white/10 mb-6">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-white/5 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="wallet" 
              className="data-[state=active]:bg-white/5 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500"
            >
              Wallet
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-white/5 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500"
            >
              My Content
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="glass-card border-white/10 text-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Profile Details</CardTitle>
                  <CardDescription className="text-gray-300">
                    Manage your personal information
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-emerald-400" />
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Name</label>
                      <Input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        className="bg-black/30 border-white/10 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        {user.email ? 'Email' : 'Phone'}
                      </label>
                      {user.email ? (
                        <Input 
                          value={editEmail} 
                          onChange={(e) => setEditEmail(e.target.value)} 
                          className="bg-black/30 border-white/10 text-white"
                        />
                      ) : (
                        <Input 
                          value={editPhone} 
                          onChange={(e) => setEditPhone(e.target.value)} 
                          className="bg-black/30 border-white/10 text-white"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-300">Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    
                    {user.email && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-300">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    )}
                    
                    {user.phone && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-300">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-300">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-white/10 pt-4">
                {isEditing ? (
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <Card className="glass-card border-white/10 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Your Wallet</CardTitle>
                <CardDescription className="text-gray-300">
                  Track your earnings from content
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <Wallet className="h-5 w-5 text-emerald-400 mr-2" />
                    <span className="text-sm text-emerald-400">Available Balance</span>
                  </div>
                  <div className="text-3xl font-bold text-white">${user.balance.toFixed(2)}</div>
                  <div className="text-xs text-gray-300 mt-2">
                    Updated as of {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Transaction History</h3>
                  {user.balance > 0 ? (
                    <div className="space-y-2">
                      {/* Sample transactions */}
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-md">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                            <Plus className="h-4 w-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Content Purchase</p>
                            <p className="text-xs text-gray-400">Yesterday</p>
                          </div>
                        </div>
                        <span className="text-emerald-400">+$9.99</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-gray-400">
                      <History className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p>No transactions yet</p>
                      <p className="text-xs mt-1">When you sell content, your earnings will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* My Content Tab */}
          <TabsContent value="content">
            <Card className="glass-card border-white/10 text-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">My Content</CardTitle>
                  <CardDescription className="text-gray-300">
                    Manage content you've created
                  </CardDescription>
                </div>
                <Button 
                  className="gap-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => navigate('/create')}
                >
                  <Plus className="h-4 w-4" />
                  New
                </Button>
              </CardHeader>
              
              <CardContent>
                {userContents.length > 0 ? (
                  <div className="space-y-4">
                    {userContents.map((content) => (
                      <div key={content.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{content.title}</h3>
                            <p className="text-xs text-gray-400 mt-1">
                              ${content.price.toFixed(2)} · {content.type} · 
                              Created {new Date(content.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 bg-white/5 border-white/10"
                              onClick={() => navigate(`/edit-content/${content.id}`)}
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 bg-white/5 border-white/10"
                              onClick={() => navigate(`/content/${content.id}`)}
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <Lock className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>You haven't created any content yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 bg-white/5 border-white/10"
                      onClick={() => navigate('/create')}
                    >
                      Create Your First Content
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
