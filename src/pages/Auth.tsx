
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, User, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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

const Auth = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isPhoneSignUp, setIsPhoneSignUp] = useState(false);
  
  // Form states for sign in
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Form states for sign up
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  // Check if user is already logged in
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      // Already logged in, redirect to home
      navigate('/');
    }
  }, [navigate]);
  
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would authenticate via a backend
    // For demo, check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: UserData) => 
      (u.email === signInEmail || u.phone === signInEmail) && signInPassword === 'password'
    );
    
    if (user) {
      // Store current user data in localStorage
      localStorage.setItem('userData', JSON.stringify(user));
      toast.success('Signed in successfully!');
      navigate('/');
    } else {
      toast.error('Invalid credentials. Please try again or sign up.');
    }
  };
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new user object
    const newUser: UserData = {
      id: crypto.randomUUID(),
      name: signUpName,
      balance: 0,
      createdAt: new Date().toISOString()
    };
    
    if (isPhoneSignUp) {
      newUser.phone = signUpPhone;
    } else {
      newUser.email = signUpEmail;
    }
    
    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const userExists = existingUsers.some((user: UserData) => 
      (user.email === signUpEmail) || (user.phone === signUpPhone)
    );
    
    if (userExists) {
      toast.error('User already exists with this email or phone');
      return;
    }
    
    // Add new user to users array
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Auto sign in the new user
    localStorage.setItem('userData', JSON.stringify(newUser));
    
    toast.success('Account created successfully!');
    navigate('/');
  };
  
  const handleGoogleAuth = () => {
    // In a real app, this would initiate Google OAuth
    // For demo, create a demo Google user
    const googleUser: UserData = {
      id: crypto.randomUUID(),
      name: 'Google User',
      email: 'google@example.com',
      balance: 0,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(googleUser));
    
    // Add to users array if not already there
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (!existingUsers.some((u: UserData) => u.email === googleUser.email)) {
      localStorage.setItem('users', JSON.stringify([...existingUsers, googleUser]));
    }
    
    toast.success('Google authentication successful!');
    navigate('/');
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleSignUpMethod = () => {
    setIsPhoneSignUp(!isPhoneSignUp);
  };
  
  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      {/* Background elements */}
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <div className="relative z-10 w-full mx-auto px-3 py-4 sm:px-4 md:px-6 max-w-md">
        <button 
          onClick={() => navigate('/')} 
          className="mb-4 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        <Card className="glass-card border-white/10 text-white overflow-hidden">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-white/10">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-white/5 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="data-[state=active]:bg-white/5 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="p-4 sm:p-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                
                <div className="relative flex items-center justify-center mt-6 mb-4">
                  <Separator className="bg-white/10" />
                  <span className="absolute bg-card px-2 text-xs text-gray-400">or continue with</span>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white"
                  onClick={handleGoogleAuth}
                >
                  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0353 3.12C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.25 12.0004 19.25C8.8704 19.25 6.21537 17.14 5.2654 14.295L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="p-4 sm:p-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm">Sign up with</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-xs text-emerald-400 hover:text-emerald-300 p-0 h-auto"
                    onClick={toggleSignUpMethod}
                  >
                    Switch to {isPhoneSignUp ? 'Email' : 'Phone'}
                  </Button>
                </div>
                
                {isPhoneSignUp ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </Button>
                
                <div className="relative flex items-center justify-center mt-6 mb-4">
                  <Separator className="bg-white/10" />
                  <span className="absolute bg-card px-2 text-xs text-gray-400">or continue with</span>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white"
                  onClick={handleGoogleAuth}
                >
                  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0353 3.12C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.25 12.0004 19.25C8.8704 19.25 6.21537 17.14 5.2654 14.295L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
