
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import { ProfileData } from '@/hooks/useProfileData';

interface ProfileDisplayProps {
  profileData: ProfileData | null;
  userName: string;
  userEmail: string;
  onEdit: () => void;
}

const ProfileDisplay = ({ profileData, userName, userEmail, onEdit }: ProfileDisplayProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-black/70 mb-1 flex items-center">
          <User className="h-4 w-4 mr-2" />
          Name
        </label>
        <Input 
          value={profileData?.name || userName} 
          readOnly 
          className="bg-white/50 border-pastel-200/50 text-black" 
        />
      </div>
      
      {profileData?.bio && (
        <div>
          <label className="text-sm text-black/70 mb-1 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Bio
          </label>
          <Textarea
            value={profileData.bio}
            readOnly
            className="bg-white/50 border-pastel-200/50 text-black resize-none"
          />
        </div>
      )}
      
      {profileData?.location && (
        <div>
          <label className="text-sm text-black/70 mb-1 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </label>
          <Input
            value={profileData.location}
            readOnly
            className="bg-white/50 border-pastel-200/50 text-black"
          />
        </div>
      )}
      
      {(profileData?.twitter_url || profileData?.linkedin_url || profileData?.github_url) && (
        <div className="space-y-4 border border-pastel-200/50 rounded-md p-4 bg-white/50">
          <h3 className="text-sm font-medium flex items-center text-black">
            <Globe className="h-4 w-4 mr-2" />
            Social Media Links
          </h3>
          
          {profileData?.twitter_url && (
            <div>
              <label className="text-sm text-black/70 mb-1 flex items-center">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </label>
              <a 
                href={profileData.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pastel-700 hover:underline break-all block"
              >
                {profileData.twitter_url}
              </a>
            </div>
          )}
          
          {profileData?.linkedin_url && (
            <div>
              <label className="text-sm text-black/70 mb-1 flex items-center">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </label>
              <a 
                href={profileData.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pastel-700 hover:underline break-all block"
              >
                {profileData.linkedin_url}
              </a>
            </div>
          )}
          
          {profileData?.github_url && (
            <div>
              <label className="text-sm text-black/70 mb-1 flex items-center">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </label>
              <a 
                href={profileData.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pastel-700 hover:underline break-all block"
              >
                {profileData.github_url}
              </a>
            </div>
          )}
        </div>
      )}
      
      <div>
        <label className="text-sm text-black/70 mb-1 flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </label>
        <Input value={userEmail} className="bg-white/50 border-pastel-200/50 text-black" readOnly />
      </div>
      
      <div className="pt-4">
        <Button 
          variant="outline" 
          onClick={onEdit}
          className="w-full border-pastel-200/50 bg-pastel-500/10 text-pastel-700 hover:bg-pastel-500/20"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileDisplay;
