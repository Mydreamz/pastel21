import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userContents, setUserContents] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const parsedAuth = JSON.parse(auth);
          if (parsedAuth && parsedAuth.user) {
            setIsAuthenticated(true);
            setUserData(parsedAuth.user);

            // Get user contents from Supabase
            const { data: contents } = await supabase
              .from('contents')
              .select('*')
              .eq('creator_id', parsedAuth.user.id);
            setUserContents(contents || []);

            // Calculate balance from unlocked content (transactions)
            const { data: transactions } = await supabase
              .from('transactions')
              .select('*')
              .eq('creator_id', parsedAuth.user.id);

            const userEarnings = (transactions || [])
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
  
  const handleDeleteContent = async (contentId: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase.from('contents').delete().eq('id', contentId);
      if (error) throw error;

      setUserContents(prevContents => prevContents.filter(content => content.id !== contentId));

      toast({
        title: "Content deleted",
        description: "Your content has been successfully deleted."
      });
    } catch (error: any) {
      console.error("Error deleting content:", error);
      toast({
        title: "Delete failed",
        description: error.message || "An error occurred while deleting your content.",
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
