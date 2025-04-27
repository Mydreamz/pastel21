
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Save } from 'lucide-react';

interface AccountSettingsProps {
  userData: any;
}

const AccountSettings = ({ userData }: AccountSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData?.user_metadata?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const userEmail = userData?.email || '';
  const userInitial = name.charAt(0).toUpperCase() || 'U';
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name }
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
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="pt-4">
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userData?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-emerald-500/20 text-emerald-500 text-2xl">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </div>
      
        <div>
          <label className="text-sm text-gray-400 mb-1 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Name
          </label>
          {isEditing ? (
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 text-white" 
            />
          ) : (
            <Input value={name} className="bg-white/5 border-white/10 text-white" readOnly />
          )}
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-1 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </label>
          <Input value={userEmail} className="bg-white/5 border-white/10 text-white" readOnly />
        </div>
        
        <div className="pt-4 flex space-x-2">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1 border-white/10 hover:bg-white/10"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="w-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
