
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userContents, setUserContents] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const parsedAuth = JSON.parse(auth);
          if (parsedAuth && parsedAuth.user) {
            setIsAuthenticated(true);
            setUserData(parsedAuth.user);
            
            // Get user contents
            const contents = JSON.parse(localStorage.getItem('contents') || '[]');
            const userContents = contents.filter((content: any) => content.creatorId === parsedAuth.user.id);
            setUserContents(userContents);
            
            // Calculate balance from unlocked content
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const userEarnings = transactions
              .filter((tx: any) => tx.creatorId === parsedAuth.user.id)
              .reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0);
            
            setBalance(userEarnings);
          } else {
            redirectToHome();
          }
        } catch (e) {
          console.error("Auth parsing error", e);
          redirectToHome();
        }
      } else {
        redirectToHome();
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const redirectToHome = () => {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive"
    });
    navigate('/');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('auth');
    toast({
      title: "Logged out successfully"
    });
    navigate('/');
  };
  
  const handleEditContent = (contentId: string) => {
    navigate(`/edit/${contentId}`);
  };
  
  const handleDeleteContent = (contentId: string) => {
    try {
      const contents = JSON.parse(localStorage.getItem('contents') || '[]');
      const updatedContents = contents.filter((content: any) => content.id !== contentId);
      localStorage.setItem('contents', JSON.stringify(updatedContents));
      
      setUserContents(prevContents => prevContents.filter(content => content.id !== contentId));
      
      toast({
        title: "Content deleted",
        description: "Your content has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Delete failed",
        description: "An error occurred while deleting your content.",
        variant: "destructive"
      });
    }
  };

  return {
    isAuthenticated,
    userData,
    userContents,
    balance,
    handleLogout,
    handleEditContent,
    handleDeleteContent
  };
};
