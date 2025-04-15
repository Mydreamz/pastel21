
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';
import StarsBackground from '@/components/StarsBackground';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle, User, LogIn } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [recentContents, setRecentContents] = useState<any[]>([]);

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

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const parsedAuth = JSON.parse(auth);
          if (parsedAuth && parsedAuth.user) {
            setIsAuthenticated(true);
            setUserData(parsedAuth.user);
          }
        } catch (e) {
          console.error("Auth parsing error", e);
        }
      }
    };
    
    // Load recent contents
    const loadRecentContents = () => {
      try {
        const contents = JSON.parse(localStorage.getItem('contents') || '[]');
        // Sort by created date, newest first
        const sorted = contents.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 6); // Get only the most recent 6
        
        setRecentContents(sorted);
      } catch (e) {
        console.error("Error loading recent contents", e);
      }
    };
    
    checkAuth();
    loadRecentContents();
  }, []);

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    try {
      // In a real app, this would call an API
      // For demo, we'll check against localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        u.email.toLowerCase() === values.email.toLowerCase()
      );
      
      if (user && user.password === values.password) {
        // Set authentication state
        const authData = {
          isAuthenticated: true,
          token: `dummy-token-${Date.now()}`,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          }
        };
        
        localStorage.setItem('auth', JSON.stringify(authData));
        setIsAuthenticated(true);
        setUserData(authData.user);
        setShowAuthDialog(false);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleSignup = (values: z.infer<typeof signupSchema>) => {
    try {
      // In a real app, this would call an API
      // For demo, we'll save to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      const existingUser = users.find((u: any) => 
        u.email.toLowerCase() === values.email.toLowerCase()
      );
      
      if (existingUser) {
        toast({
          title: "Signup failed",
          description: "Email already in use",
          variant: "destructive"
        });
        return;
      }
      
      // Create new user
      const newUser = {
        id: uuidv4(),
        name: values.name,
        email: values.email,
        password: values.password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after signup
      const authData = {
        isAuthenticated: true,
        token: `dummy-token-${Date.now()}`,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt
        }
      };
      
      localStorage.setItem('auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUserData(authData.user);
      setShowAuthDialog(false);
      
      toast({
        title: "Account created",
        description: `Welcome, ${values.name}!`
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    setUserData(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
  };
  
  const viewContent = (contentId: string) => {
    navigate(`/view/${contentId}`);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-hidden">
      {/* Background elements */}
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <header className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full"></div>
            <span className="font-bold text-xl">contentflow</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            {isAuthenticated && (
              <>
                <a href="#contents" className="text-gray-300 hover:text-white transition-colors">Contents</a>
                <a href="#" onClick={() => navigate('/profile')} className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
              </>
            )}
          </nav>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="outline" 
                  className="hidden sm:flex items-center gap-2 border-white/10 hover:bg-white/10"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4" />
                  {userData?.name}
                </Button>
                <Button 
                  onClick={() => navigate('/create')} 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
                >
                  Create Content
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden sm:inline-flex text-gray-300 hover:text-white"
                  onClick={() => {
                    setAuthTab('login');
                    setShowAuthDialog(true);
                  }}
                >
                  Sign in
                </Button>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
                  onClick={() => {
                    setAuthTab('signup');
                    setShowAuthDialog(true);
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-6 relative z-10">
        <section className="py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <Hero />
            <Dashboard />
          </div>
        </section>
        
        {recentContents.length > 0 && (
          <section id="contents" className="py-16 md:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Content</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Discover the latest premium content from our creators</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentContents.map((content) => (
                <div key={content.id} className="glass-card rounded-xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{content.teaser}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">By {content.creatorName}</div>
                      <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                        ${parseFloat(content.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-2">
                    <Button 
                      onClick={() => viewContent(content.id)} 
                      className="w-full bg-white/5 hover:bg-white/10 text-white"
                    >
                      View Content
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {isAuthenticated ? (
              <div className="mt-12 text-center">
                <Button 
                  onClick={() => navigate('/create')} 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                >
                  Create Your Own Content
                </Button>
              </div>
            ) : (
              <div className="mt-12 text-center">
                <Button 
                  onClick={() => {
                    setAuthTab('signup');
                    setShowAuthDialog(true);
                  }} 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                >
                  Sign Up to Create Content
                </Button>
              </div>
            )}
          </section>
        )}
        
        <section id="features" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything creators need to succeed</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">All the tools you need to create, grow, and monetize your audience in one powerful platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Content Creation",
                description: "Easily create and schedule content across multiple platforms from a single dashboard.",
                icon: "📝"
              },
              {
                title: "Audience Growth",
                description: "Grow your audience with powerful analytics and targeted engagement strategies.",
                icon: "📈"
              },
              {
                title: "Monetization",
                description: "Turn your passion into profit with multiple revenue streams and payment processing.",
                icon: "💰"
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-6 rounded-xl">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section id="pricing" className="py-16 md:py-24">
          <div className="glass-card p-8 md:p-12 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start monetizing your content?</h2>
                <p className="text-gray-400 mb-6">Join thousands of creators who are earning more with our platform.</p>
                
                <ul className="space-y-3 mb-8">
                  {["Free to get started", "No credit card required", "Cancel anytime"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 h-12 text-base font-medium"
                  onClick={() => {
                    setAuthTab('signup');
                    setShowAuthDialog(true);
                  }}
                >
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="glass-card p-6 rounded-xl border border-emerald-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Pro Plan</h3>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">Popular</div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400 text-sm">Billed annually ($348/year)</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited content creation",
                    "Advanced analytics",
                    "Custom branding",
                    "Priority support",
                    "Multiple payment methods"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-12 border-t border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Integrations", "Updates"].map((item, i) => (
                <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Contact"].map((item, i) => (
                <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "Guides", "Support", "API"].map((item, i) => (
                <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Security", "Cookies"].map((item, i) => (
                <li key={i}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm">
          © 2025 ContentFlow. All rights reserved.
        </div>
      </footer>
      
      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="glass-card border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{authTab === 'login' ? 'Sign In' : 'Create Account'}</DialogTitle>
            <DialogDescription className="text-gray-300">
              {authTab === 'login' 
                ? 'Sign in to your account to access your dashboard'
                : 'Create a new account to get started with ContentFlow'}
            </DialogDescription>
          </DialogHeader>
          
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
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" className="bg-white/5 border-white/10 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    Sign In
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm text-gray-400">
                <p>Don't have an account?{' '}
                  <button onClick={() => setAuthTab('signup')} className="text-emerald-500 hover:underline">
                    Create one
                  </button>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-4">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField control={signupForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={signupForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" className="bg-white/5 border-white/10 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={signupForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    Create Account
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm text-gray-400">
                <p>Already have an account?{' '}
                  <button onClick={() => setAuthTab('login')} className="text-emerald-500 hover:underline">
                    Sign in
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
