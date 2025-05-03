
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfileData } from '@/hooks/useProfileData';
import AccountAvatar from './AccountAvatar';
import ProfileForm from './ProfileForm';
import ProfileDisplay from './ProfileDisplay';
import type { ProfileFormValues } from './ProfileForm';

interface AccountSettingsProps {
  userData: any;
}

const AccountSettings = ({ userData }: AccountSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { profileData, updateProfile } = useProfileData();
  
  const userEmail = userData?.email || '';
  const userName = profileData?.name || userData?.user_metadata?.name || '';
  const userInitial = userName.charAt(0).toUpperCase() || 'U';

  const handleSave = async (values: ProfileFormValues) => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: values.name }
      });
      
      if (authError) throw authError;
      
      const { error } = await updateProfile({
        name: values.name,
        bio: values.bio || null,
        location: values.location || null,
        twitter_url: values.twitter_url || null,
        linkedin_url: values.linkedin_url || null,
        github_url: values.github_url || null
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile information."
      });
      console.error("Profile update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getDefaultFormValues = () => {
    return {
      name: profileData?.name || userName,
      bio: profileData?.bio || '',
      location: profileData?.location || '',
      twitter_url: profileData?.twitter_url || '',
      linkedin_url: profileData?.linkedin_url || '',
      github_url: profileData?.github_url || '',
    };
  };
  
  return (
    <div className="pt-4">
      <div className="space-y-6">
        <AccountAvatar 
          avatarUrl={userData?.user_metadata?.avatar_url}
          userInitial={userInitial}
        />
      
        {isEditing ? (
          <ProfileForm 
            defaultValues={getDefaultFormValues()}
            userEmail={userEmail}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            isSaving={isSaving}
          />
        ) : (
          <ProfileDisplay 
            profileData={profileData}
            userName={userName}
            userEmail={userEmail}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
