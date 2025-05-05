
import { useCallback, useRef } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/profile';

/**
 * Hook for profile action handlers
 */
export const useProfileActions = (
  navigate: NavigateFunction,
  toast: any,
  setUserContents: React.Dispatch<React.SetStateAction<any[]>>
) => {
  // Use a ref to track in-progress profile updates
  const updateInProgress = useRef(false);
  
  // Handle logout action
  const handleLogout = useCallback(async () => {
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
  }, [navigate, toast]);
  
  // Handle edit content action
  const handleEditContent = useCallback((contentId: string) => {
    navigate(`/edit/${contentId}`);
  }, [navigate]);
  
  // Handle delete content action
  const handleDeleteContent = useCallback(async (contentId: string) => {
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
  }, [setUserContents, toast]);
  
  // Handle profile update action
  const updateProfile = useCallback(async (profileData: Partial<ProfileData>) => {
    if (updateInProgress.current) return { error: new Error("Update already in progress") };
    
    updateInProgress.current = true;
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { error: new Error("User not authenticated") };
      }
      
      // Call the Edge Function to update profile data
      const { data, error } = await supabase.functions.invoke('get-profile', {
        body: { 
          action: 'update', 
          profileData 
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Profile update error:", error);
      return { error };
    } finally {
      updateInProgress.current = false;
    }
  }, []);

  return {
    handleLogout,
    handleEditContent,
    handleDeleteContent,
    updateProfile
  };
};
