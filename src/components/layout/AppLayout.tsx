
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from '@/components/navigation/BottomNav';
import Footer from '@/components/navigation/Footer';
import AuthDialog from '@/components/auth/AuthDialog';
import StarsBackground from '@/components/StarsBackground';
import { BackToTop } from '@/components/ui/back-to-top';
import MainNav from '@/components/navigation/MainNav';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const location = useLocation();
  const { session } = useAuth();
  const isAuthenticated = !!session;

  const openAuthDialog = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setShowAuthDialog(true);
  };

  // Don't show stars background on certain pages for better performance
  const showStarsBackground = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showStarsBackground && <StarsBackground />}
      
      {/* Always show MainNav - it will handle its own visibility for auth state */}
      <MainNav openAuthDialog={openAuthDialog} />
      
      <main className="flex-1 mobile-content">
        {children}
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

export default AppLayout;
