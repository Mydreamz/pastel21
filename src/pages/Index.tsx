import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import AnimatedHeading from '@/components/ui/animated-heading';
const Index = () => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const {
    user,
    session,
    isLoading
  } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && session && user) {
      navigate('/dashboard', {
        replace: true
      });
    }
  }, [session, user, isLoading, navigate]);
  const openAuthDialog = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setShowAuthDialog(true);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-high-contrast text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-primary border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>;
  }

  // If authenticated, don't render the landing page (navigation will happen via useEffect)
  if (session && user) {
    return null;
  }
  return <div className="min-h-screen flex flex-col antialiased text-high-contrast relative overflow-hidden pb-16 md:pb-0">
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

        <RecentContent isAuthenticated={!!session} openAuthDialog={openAuthDialog} />
        
        <section id="features" className="py-16 md:py-24">
          <div className="text-center mb-16 space-y-4">
            <AnimatedHeading level={2} variant="gradient">
              Everything creators need to monetize
            </AnimatedHeading>
            <p className="text-readable max-w-3xl mx-auto text-lg">
              All the tools you need to create, grow, and monetize your audience in one powerful platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{
            title: "Content Creation",
            description: "Easily create and schedule content across multiple platforms from a single dashboard.",
            icon: "📝"
          }, {
            title: "Audience Growth",
            description: "Grow your audience with powerful analytics and targeted engagement strategies.",
            icon: "📈"
          }, {
            title: "Monetization",
            description: "Turn your passion into profit with multiple revenue streams and payment processing.",
            icon: "💰"
          }].map((feature, i) => <div key={i} className="glass-card shadow-neumorphic backdrop-blur-xl rounded-2xl p-8 hover:shadow-elevated transition-all duration-300">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-high-contrast font-display">{feature.title}</h3>
                <p className="text-readable leading-relaxed">{feature.description}</p>
              </div>)}
          </div>
        </section>
        
        <section id="pricing" className="py-16 md:py-24">
          
        </section>
      </main>

      
      <MobileBottomNav openAuthDialog={openAuthDialog} />
      <BackToTop />
      
      <AuthDialog showAuthDialog={showAuthDialog} setShowAuthDialog={setShowAuthDialog} authTab={authTab} setAuthTab={setAuthTab} setIsAuthenticated={() => {}} setUserData={() => {}} />
    </div>;
};
export default Index;