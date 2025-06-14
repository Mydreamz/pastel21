
import React, { useState } from 'react';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';
import StarsBackground from '@/components/StarsBackground';
import { useToast } from "@/hooks/use-toast";
import MainNav from '@/components/navigation/MainNav';
import Footer from '@/components/navigation/Footer';
import AuthDialog from '@/components/auth/AuthDialog';
import RecentContent from '@/components/content/RecentContent';
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BackToTop } from '@/components/ui/back-to-top';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const openAuthDialog = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setShowAuthDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased relative overflow-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <MainNav openAuthDialog={openAuthDialog} />
      
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-6 relative z-10 pb-20 md:pb-8">
        <section className="hero-mobile md:hero-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <Hero openAuthDialog={openAuthDialog} />
            <Dashboard />
          </div>
        </section>

        <RecentContent 
          isAuthenticated={!!session}
          openAuthDialog={openAuthDialog}
        />
        
        <section id="features" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything creators need to monetize</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All the tools you need to create, grow, and monetize your audience in one powerful platform.
            </p>
          </div>
          
          <div className="content-grid">
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
              <div key={i} className="app-card p-6 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section id="pricing" className="py-16 md:py-24">
          <div className="app-card p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start monetizing your content?</h2>
                <p className="text-muted-foreground mb-6">Join thousands of creators who are earning more with our platform.</p>
                
                <ul className="space-y-3 mb-8">
                  {["Free to get started", "No credit card required", "Cancel anytime"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full md:w-auto"
                  onClick={() => openAuthDialog('signup')}
                >
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="app-card p-6 border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Pro Plan</h3>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">Popular</div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">₹1999</span>
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
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button for mobile */}
      {session && (
        <button 
          onClick={() => navigate('/create')}
          className="fab md:hidden"
        >
          <Plus className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      <Footer />
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
