
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';

interface MainNavProps {
  isAuthenticated: boolean;
  userData: any;
  handleLogout: () => void;
  openAuthDialog: (tab: 'login' | 'signup') => void;
}

const MainNav = ({ isAuthenticated, userData, handleLogout, openAuthDialog }: MainNavProps) => {
  const navigate = useNavigate();
  
  return (
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
                onClick={() => openAuthDialog('login')}
              >
                Sign in
              </Button>
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
                onClick={() => openAuthDialog('signup')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNav;
