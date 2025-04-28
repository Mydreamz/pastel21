import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Save, MapPin, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useProfileData, ProfileData } from '@/hooks/useProfileData';
import { supabase } from "@/integrations/supabase/client";

interface AccountSettingsProps {
  userData: any;
}

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  bio: z.string().max(300, { message: "Bio must be 300 characters or less." }).optional(),
  location: z.string().max(100, { message: "Location must be 100 characters or less." }).optional(),
  twitter_url: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal("")),
  linkedin_url: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal("")),
  github_url: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal("")),
});

const AccountSettings = ({ userData }: AccountSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { profileData, updateProfile } = useProfileData();
  
  const userEmail = userData?.email || '';
  const userName = profileData?.name || userData?.user_metadata?.name || '';
  const userInitial = userName.charAt(0).toUpperCase() || 'U';

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userName,
      bio: '',
      location: '',
      twitter_url: '',
      linkedin_url: '',
      github_url: '',
    }
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || userName,
        bio: profileData.bio || '',
        location: profileData.location || '',
        twitter_url: profileData.twitter_url || '',
        linkedin_url: profileData.linkedin_url || '',
        github_url: profileData.github_url || '',
      });
    }
  }, [profileData, form, userName]);
  
  const handleSave = async (values: z.infer<typeof profileSchema>) => {
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
      
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-400 mb-1 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-400 mb-1 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Tell us about yourself..."
                        className="bg-white/5 border-white/10 text-white resize-none min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-400 mb-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="City, Country"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4 border border-white/10 rounded-md p-4 bg-white/5">
                <h3 className="text-sm font-medium flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Social Media Links
                </h3>
                
                <FormField
                  control={form.control}
                  name="twitter_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-400 mb-1 flex items-center">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://twitter.com/username"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-400 mb-1 flex items-center">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://linkedin.com/in/username"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="github_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-400 mb-1 flex items-center">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://github.com/username"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormLabel className="text-sm text-gray-400 mb-1 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email (Read-only)
                </FormLabel>
                <Input 
                  value={userEmail}
                  readOnly
                  className="bg-white/5 border-white/10 text-white opacity-70"
                />
              </div>
              
              <div className="pt-4 flex space-x-2">
                <Button 
                  type="submit" 
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
                  type="button"
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border-white/10 hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Name
              </label>
              <Input 
                value={profileData?.name || userName} 
                readOnly 
                className="bg-white/5 border-white/10 text-white" 
              />
            </div>
            
            {profileData?.bio && (
              <div>
                <label className="text-sm text-gray-400 mb-1 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Bio
                </label>
                <Textarea
                  value={profileData.bio}
                  readOnly
                  className="bg-white/5 border-white/10 text-white resize-none"
                />
              </div>
            )}
            
            {profileData?.location && (
              <div>
                <label className="text-sm text-gray-400 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </label>
                <Input
                  value={profileData.location}
                  readOnly
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            )}
            
            {(profileData?.twitter_url || profileData?.linkedin_url || profileData?.github_url) && (
              <div className="space-y-4 border border-white/10 rounded-md p-4 bg-white/5">
                <h3 className="text-sm font-medium flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Social Media Links
                </h3>
                
                {profileData?.twitter_url && (
                  <div>
                    <label className="text-sm text-gray-400 mb-1 flex items-center">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </label>
                    <a 
                      href={profileData.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:underline break-all block"
                    >
                      {profileData.twitter_url}
                    </a>
                  </div>
                )}
                
                {profileData?.linkedin_url && (
                  <div>
                    <label className="text-sm text-gray-400 mb-1 flex items-center">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </label>
                    <a 
                      href={profileData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:underline break-all block"
                    >
                      {profileData.linkedin_url}
                    </a>
                  </div>
                )}
                
                {profileData?.github_url && (
                  <div>
                    <label className="text-sm text-gray-400 mb-1 flex items-center">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </label>
                    <a 
                      href={profileData.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:underline break-all block"
                    >
                      {profileData.github_url}
                    </a>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <label className="text-sm text-gray-400 mb-1 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </label>
              <Input value={userEmail} className="bg-white/5 border-white/10 text-white" readOnly />
            </div>
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="w-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
