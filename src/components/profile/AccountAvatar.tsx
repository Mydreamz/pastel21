
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AccountAvatarProps {
  avatarUrl?: string;
  userInitial: string;
}

const AccountAvatar = ({ avatarUrl, userInitial }: AccountAvatarProps) => {
  return (
    <div className="flex justify-center mb-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="bg-pastel-500/20 text-pastel-700 text-2xl">
          {userInitial}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AccountAvatar;
