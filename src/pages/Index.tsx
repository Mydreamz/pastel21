
import React, { useState } from 'react';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';
import StarsBackground from '@/components/StarsBackground';
import { useToast } from "@/hooks/use-toast";
import MainNav from '@/components/navigation/MainNav';
import MobileBottomNav from '@/components/navigation/MobileBottomNav';
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
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative overflow-hidden pb-16 md:pb-0">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <MainNav openAuthDialog={openAuthDialog} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <section className="py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Hero openAuthDialog={openAuthDialog} />
            <div className="order-first lg:order-last">
              <Dashboard />
            </div>
          </div>
        </section>

        <RecentContent 
          isAuthenticated={!!session}
          openAuthDialog={openAuthDialog}
        />
        
        <section id="features" className="py-16 md:py-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-display text-gray-900">
              Everything creators need to monetize
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              All the tools you need to create, grow, and monetize your audience in one powerful platform.
            </p>
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
              <div key={i} className="glass-card shadow-neumorphic backdrop-blur-xl bg-white/60 rounded-2xl p-8 hover:shadow-elevated transition-all duration-300">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 font-display">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section id="pricing" className="py-16 md:py-24">
          <div className="glass-card shadow-neumorphic backdrop-blur-xl bg-white/60 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-display text-gray-900">
                  Ready to start monetizing your content?
                </h2>
                <p className="text-gray-600 text-lg">Join thousands of creators who are earning more with our platform.</p>
                
                <ul className="space-y-4">
                  {["Free to get started", "No credit card required", "Cancel anytime"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-pastel-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  size="lg"
                  className="bg-pastel-600 hover:bg-pastel-700 text-white shadow-elevated hover:shadow-lg transition-all duration-200 px-8 py-3"
                  onClick={() => openAuthDialog('signup')}
                >
                  Start for free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="glass-card p-8 backdrop-blur-xl bg-white/80 rounded-2xl border border-gray-200/50 shadow-elevated">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 font-display">Pro Plan</h3>
                  <div className="px-3 py-1 rounded-full bg-pastel-100 text-pastel-700 text-sm font-medium">Popular</div>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-gray-900">₹1999</span>
                    <span className="text-gray-600 pb-1">/month</span>
                  </div>
                  <p className="text-gray-500 text-sm">Billed annually (₹23,988/year)</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {[
                    "Unlimited content creation",
                    "Advanced analytics",
                    "Custom branding",
                    "Priority support",
                    "Multiple payment methods"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-pastel-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full bg-pastel-600 hover:bg-pastel-700 text-white shadow-lg">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav openAuthDialog={openAuthDialog} />
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
