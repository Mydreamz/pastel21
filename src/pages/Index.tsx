
import React, { useState } from 'react';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';
import StarsBackground from '@/components/StarsBackground';
import { useToast } from "@/hooks/use-toast";
import MainNav from '@/components/navigation/MainNav';
import BottomNav from '@/components/navigation/BottomNav';
import Footer from '@/components/navigation/Footer';
import AuthDialog from '@/components/auth/AuthDialog';
import RecentContent from '@/components/content/RecentContent';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BackToTop } from '@/components/ui/back-to-top';

const Index = () => {
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const { user, session } = useAuth();

  const openAuthDialog = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setShowAuthDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StarsBackground />
      
      <MainNav openAuthDialog={openAuthDialog} />
      
      <main className="flex-1 mobile-content">
        <div className="container">
          <section className="py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
              <Hero openAuthDialog={openAuthDialog} />
              <div className="hidden lg:block">
                <Dashboard />
              </div>
            </div>
          </section>

          <RecentContent 
            isAuthenticated={!!session}
            openAuthDialog={openAuthDialog}
          />
          
          <section id="features" className="py-12 md:py-16 lg:py-20">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-lora text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Everything creators need to monetize
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                All the tools you need to create, grow, and monetize your audience in one powerful platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <div key={i} className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow touch-target">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="font-lora text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section id="pricing" className="py-12 md:py-16 lg:py-20">
            <div className="bg-card rounded-xl border p-6 md:p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                <div>
                  <h2 className="font-lora text-2xl md:text-3xl font-bold mb-4">
                    Ready to start monetizing your content?
                  </h2>
                  <p className="text-muted-foreground mb-6 text-base md:text-lg leading-relaxed">
                    Join thousands of creators who are earning more with our platform.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {["Free to get started", "No credit card required", "Cancel anytime"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full sm:w-auto h-12 px-8 text-base font-medium touch-target"
                    onClick={() => openAuthDialog('signup')}
                  >
                    Start for free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-background rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-lora text-xl font-semibold">Pro Plan</h3>
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      Popular
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="font-lora text-4xl font-bold">₹1999</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-muted-foreground text-sm">Billed annually (₹23,988/year)</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      "Unlimited content creation",
                      "Advanced analytics",
                      "Custom branding",
                      "Priority support",
                      "Multiple payment methods"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full h-12 touch-target">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Desktop Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav openAuthDialog={openAuthDialog} />
      
      <BackToTop />
      
      <AuthDialog
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        authTab={authTab}
        setAuthTab={setAuthTab}
        setIsAuthenticated={() => {}}
        setUserData={() => {}}
      />
    </div>
  );
};

export default Index;
