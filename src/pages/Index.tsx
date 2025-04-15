
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Hero from '@/components/Hero';
import StarsBackground from '@/components/StarsBackground';

interface UserData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  balance: number;
  createdAt: string;
}

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  
  useEffect(() => {
    // Check if user is logged in on component mount
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-white relative overflow-x-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>
      
      <header className="relative z-10 w-full py-4 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white flex items-center">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              PayLock
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Home</Button>
            </Link>
            <Link to="/browse">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Browse</Button>
            </Link>
            <Link to="/create">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Create</Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-emerald-500/20 p-0 text-white">
                    <span className="sr-only">User menu</span>
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-white/10 bg-black/70">
                  <DropdownMenuLabel className="text-white">{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <Link to="/profile">
                    <DropdownMenuItem className="text-gray-200 focus:bg-white/10 focus:text-white cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/profile?tab=wallet">
                    <DropdownMenuItem className="text-gray-200 focus:bg-white/10 focus:text-white cursor-pointer">
                      Wallet (${user.balance.toFixed(2)})
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/profile?tab=content">
                    <DropdownMenuItem className="text-gray-200 focus:bg-white/10 focus:text-white cursor-pointer">
                      My Content
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem('userData');
                      window.location.reload();
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Sign In</Button>
              </Link>
            )}
          </div>
          
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={toggleMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 p-3 z-20">
            <div className="glass-card border-white/10 rounded-lg p-2 shadow-xl space-y-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  Home
                </Button>
              </Link>
              <Link to="/browse" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  Browse
                </Button>
              </Link>
              <Link to="/create" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  Create
                </Button>
              </Link>
              
              {user ? (
                <>
                  <Separator className="bg-white/10 my-2" />
                  <p className="px-3 py-1 text-sm text-gray-400">{user.name}</p>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      Profile
                    </Button>
                  </Link>
                  <Link to="/profile?tab=wallet" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      Wallet (${user.balance.toFixed(2)})
                    </Button>
                  </Link>
                  <Link to="/profile?tab=content" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      My Content
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-300"
                    onClick={() => {
                      localStorage.removeItem('userData');
                      window.location.reload();
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-2">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1 relative z-10">
        <Hero />
      </main>
    </div>
  );
};

export default Index;
