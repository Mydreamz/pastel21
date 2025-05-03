
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, MapPin, Globe, Twitter, Linkedin, Github, Mail, Save } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  bio: z.string().max(300, { message: "Bio must be 300 characters or less." }).optional(),
  location: z.string().max(100, { message: "Location must be 100 characters or less." }).optional(),
  twitter_url: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal("")),
  linkedin_url: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal("")),
  github_url: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues: ProfileFormValues;
  userEmail: string;
  onSave: (values: ProfileFormValues) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const ProfileForm = ({ defaultValues, userEmail, onSave, onCancel, isSaving }: ProfileFormProps) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    await onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-black/70 mb-1 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Name
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="bg-white/50 border-pastel-200/50 text-black"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-black/70 mb-1 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Bio
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Tell us about yourself..."
                  className="bg-white/50 border-pastel-200/50 text-black resize-none min-h-[100px]"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-black/70 mb-1 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="City, Country"
                  className="bg-white/50 border-pastel-200/50 text-black"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        
        <div className="space-y-4 border border-pastel-200/50 rounded-md p-4 bg-white/50">
          <h3 className="text-sm font-medium flex items-center text-black">
            <Globe className="h-4 w-4 mr-2" />
            Social Media Links
          </h3>
          
          <FormField
            control={form.control}
            name="twitter_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-black/70 mb-1 flex items-center">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="https://twitter.com/username"
                    className="bg-white/50 border-pastel-200/50 text-black"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-black/70 mb-1 flex items-center">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="https://linkedin.com/in/username"
                    className="bg-white/50 border-pastel-200/50 text-black"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="github_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-black/70 mb-1 flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="https://github.com/username"
                    className="bg-white/50 border-pastel-200/50 text-black"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <FormLabel className="text-sm text-black/70 mb-1 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email (Read-only)
          </FormLabel>
          <Input 
            value={userEmail}
            readOnly
            className="bg-white/50 border-pastel-200/50 text-black opacity-70"
          />
        </div>
        
        <div className="pt-4 flex space-x-2">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="flex-1 bg-pastel-500 hover:bg-pastel-600 text-white"
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
            onClick={onCancel}
            className="flex-1 border-pastel-200/50 hover:bg-pastel-100/50 text-black"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
