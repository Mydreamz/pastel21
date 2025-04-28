
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/App';

// Define a ProfileData type to use throughout the application
export interface ProfileData {
  id: string;
  name?: string;
  bio?: string;
  location?: string;
  twitter_url?: string;
  linkedin_url?: string;
  github_url?: string;
  updated_at?: string;
}

export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, isLoading } = useAuth();
  const [userContents, setUserContents] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

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
        
        // Fetch user profile data using a more generic approach
        if (user.id) {
          try {
            // Use a more generic approach with any type
            const { data, error } = await supabase
              .rpc('get_profile_by_id', { user_id: user.id });
            
            if (error) {
              console.error("Error fetching profile:", error);
              // Fallback to direct query with type assertion
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
              
              if (profileError) {
                console.error("Profile fetch fallback failed:", profileError);
              } else if (profileData) {
                setProfileData(profileData as unknown as ProfileData);
              }
            } else if (data) {
              setProfileData(data as unknown as ProfileData);
            }
          } catch (profileError) {
            console.error("Error in profile fetch:", profileError);
          }
        }
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
  
  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!user) return { error: new Error("User not authenticated") };
    
    try {
      // Use a more generic approach to update profile
      const { error } = await supabase
        .rpc('update_profile', {
          user_id: user.id,
          profile_data: profileData
        });
        
      if (error) {
        // Fallback to direct update with type assertion
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            ...profileData,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
          
        if (updateError) {
          throw updateError;
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Profile update error:", error);
      return { error };
    }
  };

  return {
    isAuthenticated: !!session,
    userData: user,
    userContents,
    balance,
    isLoading: isLoadingData,
    profileData,
    handleLogout,
    handleEditContent,
    handleDeleteContent,
    updateProfile
  };
};
