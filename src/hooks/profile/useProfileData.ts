
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useProfileFetch } from './useProfileFetch';
import { useProfileActions } from './useProfileActions';
import { ProfileData } from '@/types/profile';

/**
 * Main hook for profile data and functionality
 */
export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, isLoading } = useAuth();
  const [userContents, setUserContents] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [fetchedData, setFetchedData] = useState(false);
  
  const hasFetchedRef = useRef(false);

  const { fetchUserProfileData, fetchUserContents } = useProfileFetch(
    setProfileData, 
    setBalance, 
    setUserContents
  );
  
  const { handleLogout, handleEditContent, handleDeleteContent, updateProfile } = useProfileActions(
    navigate, 
    toast, 
    setUserContents
  );

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    
    console.log("Fetching user data for userId:", userId);
    setIsLoadingData(true);
    
    try {
      await fetchUserProfileData(user, session);
      await fetchUserContents(userId);
      
      setFetchedData(true);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [user, session, fetchUserProfileData, fetchUserContents]);

  useEffect(() => {
    if (!isLoading && user && session && !hasFetchedRef.current) {
      fetchUserData();
    } else if (!isLoading && !session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, session, isLoading, fetchUserData, navigate, toast]);

  useEffect(() => {
    console.log("Current balance in useProfileData hook:", balance);
  }, [balance]);

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
    updateProfile,
    fetchedData,
    fetchUserData,
  };
};
