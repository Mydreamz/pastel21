
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainNavProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const MainNav = ({ openAuthDialog }: MainNavProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="nav-glass sticky top-0 z-50 w-full border-b border-border/40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="text-xl font-display font-bold text-gradient cursor-pointer"
            onClick={() => navigate('/')}
          >
            Monitize
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="glass-button text-sm px-3 py-2"
                  size={isMobile ? "sm" : "default"}
                >
                  {isMobile ? "Dashboard" : "Dashboard"}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/marketplace')}
                  className="glass-button text-sm px-3 py-2"
                  size={isMobile ? "sm" : "default"}
                >
                  {isMobile ? "Market" : "Marketplace"}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/profile')}
                  className="glass-button text-sm px-3 py-2"
                  size={isMobile ? "sm" : "default"}
                >
                  <User className="h-4 w-4" />
                  {!isMobile && <span className="ml-2">Profile</span>}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="glass-button text-sm px-3 py-2"
                  size={isMobile ? "sm" : "default"}
                >
                  {isMobile ? "Out" : "Sign Out"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openAuthDialog('login')}
                  className="glass-button text-sm px-3 py-2"
                >
                  <LogIn className="h-4 w-4" />
                  {!isMobile && <span className="ml-2">Sign In</span>}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => openAuthDialog('signup')}
                  className="btn-primary text-sm px-3 py-2"
                >
                  <UserPlus className="h-4 w-4" />
                  {!isMobile && <span className="ml-2">Sign Up</span>}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
