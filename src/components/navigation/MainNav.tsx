import React from 'react';
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
interface MainNavProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
}
const MainNav = ({
  openAuthDialog
}: MainNavProps) => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return <nav className="nav-glass sticky top-0 z-50 w-full border-b border-border/40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="/monitizelogo.png" 
              alt="Monitize Logo" 
              className="h-8 w-8 mr-2 rounded-md transition-all duration-300 hover:backdrop-blur-sm hover:bg-white/10 hover:border hover:border-white/20 hover:rounded-lg hover:p-1 hover:shadow-lg" 
              loading="eager" 
              fetchpriority="high"
              decoding="async"
            />
            <span className="font-mooxy font-bold text-gradient text-xl">Monitize.club</span>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="glass-button hidden md:inline-flex">
                  Dashboard
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="glass-button md:hidden" aria-label="Dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="glass-button">
                  <User className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Profile</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="glass-button">
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </div> : <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openAuthDialog('login')} className="glass-button">
                  <LogIn className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Sign In</span>
                </Button>
                <Button size="sm" onClick={() => openAuthDialog('signup')} className="btn-primary">
                  <UserPlus className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Sign Up</span>
                </Button>
              </div>}
          </div>
        </div>
      </div>
    </nav>;
};
export default MainNav;
