import React, { useState, lazy, Suspense } from 'react';
import Hero from '@/components/Hero';
import StarsBackground from '@/components/StarsBackground';
import { useToast } from "@/hooks/use-toast";
import MainNav from '@/components/navigation/MainNav';
import Footer from '@/components/navigation/Footer';
import { BackToTop } from '@/components/ui/back-to-top';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/App';

const Dashboard = lazy(() => import('@/components/Dashboard'));
const AuthDialog = lazy(() => import('@/components/auth/AuthDialog'));
const RecentContent = lazy(() => import('@/components/content/RecentContent'));

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
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <MainNav openAuthDialog={openAuthDialog} />
      
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-6 relative z-10">
        <section className="py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <Hero />
            <Suspense fallback={<div className="h-96 bg-white/5 rounded-lg animate-pulse" />}>
              <Dashboard />
            </Suspense>
          </div>
        </section>

        <Suspense fallback={<div className="h-48 bg-white/5 rounded-lg animate-pulse" />}>
          <RecentContent 
            isAuthenticated={!!session}
            openAuthDialog={openAuthDialog}
          />
        </Suspense>
        
        <section id="features" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything creators need to monetize with Monitize.club</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
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
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start monetizing your content with Monitize.club?</h2>
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
                  onClick={() => openAuthDialog('signup')}
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

      <Footer />
      <BackToTop />
      
      <Suspense fallback={null}>
        <AuthDialog
          showAuthDialog={showAuthDialog}
          setShowAuthDialog={setShowAuthDialog}
          authTab={authTab}
          setAuthTab={setAuthTab}
          setIsAuthenticated={() => {}}
          setUserData={() => {}}
        />
      </Suspense>
    </div>
  );
};

export default Index;
