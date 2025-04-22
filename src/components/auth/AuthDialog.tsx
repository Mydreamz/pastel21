import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogIn, User, AlertCircle } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

interface AuthDialogProps {
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
  authTab: 'login' | 'signup';
  setAuthTab: (tab: 'login' | 'signup') => void;
  setIsAuthenticated?: (isAuthenticated: boolean) => void;
  setUserData?: (userData: any) => void;
}

const AuthDialog = ({
  showAuthDialog,
  setShowAuthDialog,
  authTab,
  setAuthTab
}: AuthDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      setShowAuthDialog(false);
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
      
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(error.message || "Invalid email or password");
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name
          }
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      setShowAuthDialog(false);
      toast({
        title: "Account created",
        description: "Your account has been created successfully! Please check your email to confirm your account."
      });
      
    } catch (error: any) {
      console.error("Signup error:", error);
      setAuthError(error.message || "Failed to create account");
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogContent className="glass-card border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {authTab === 'login' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {authTab === 'login' 
              ? 'Sign in to your account to access your dashboard'
              : 'Create a new account to get started with CreatorHub'}
          </DialogDescription>
        </DialogHeader>
        
        {authError && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={authTab} onValueChange={(value) => setAuthTab(value as 'login' | 'signup')} className="w-full">
          <TabsList className="grid grid-cols-2 bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="login" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          className="bg-white/5 border-white/10 text-white"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-white/5 border-white/10 text-white"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    className="text-sm text-emerald-400 hover:underline ml-auto"
                    onClick={() => {
                      setShowAuthDialog(false);
                      window.location.href = "/forgot-password";
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2 inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      Signing In...
                    </>
                  ) : "Sign In"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center text-sm text-gray-400">
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthTab('signup')}
                  className="text-emerald-500 hover:underline"
                >
                  Create one
                </button>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-4">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="bg-white/5 border-white/10 text-white"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          className="bg-white/5 border-white/10 text-white"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-white/5 border-white/10 text-white"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2 inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      Creating Account...
                    </>
                  ) : "Create Account"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center text-sm text-gray-400">
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthTab('login')}
                  className="text-emerald-500 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
