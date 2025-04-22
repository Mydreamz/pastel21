
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/App';

export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, isLoading } = useAuth();
  const [userContents, setUserContents] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    // Get user contents and transactions only if user is authenticated
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoadingData(true);
        
        // Get user contents from Supabase
        const { data: contents, error: contentsError } = await supabase
          .from('contents')
          .select('*')
          .eq('creator_id', user.id);
          
        if (contentsError) throw contentsError;
        setUserContents(contents || []);

        // Calculate balance from unlocked content (transactions)
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('creator_id', user.id);
          
        if (transactionsError) throw transactionsError;

        const userEarnings = (transactions || [])
          .reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0);

        setBalance(userEarnings);
      } catch (e) {
        console.error("Error fetching user data:", e);
        toast({
          title: "Error loading profile data",
          description: "Failed to load your profile information",
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading) {
      if (!session) {
        // Only redirect if we've checked auth status and user is not logged in
        redirectToHome();
      } else if (session && user) {
        fetchUserData();
      }
    }
  }, [user, session, navigate, toast, isLoading]);
  
  const redirectToHome = () => {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive"
    });
    navigate('/');
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear any auth-related data from localStorage
      localStorage.removeItem('auth');
      
      toast({
        title: "Logged out successfully"
      });
      navigate('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred while logging out",
        variant: "destructive"
      });
    }
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
    isAuthenticated: !!session,
    userData: user,
    userContents,
    balance,
    isLoading: isLoadingData,
    handleLogout,
    handleEditContent,
    handleDeleteContent
  };
};
