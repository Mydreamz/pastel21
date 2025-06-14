
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MainNavProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const MainNav = ({ openAuthDialog }: MainNavProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="glass-button"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="glass-button"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openAuthDialog('login')}
                  className="glass-button"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => openAuthDialog('signup')}
                  className="btn-primary"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
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
