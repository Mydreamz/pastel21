
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type UserCountBadgeProps = {
  count: number;
}

// Sample user data for the hover card
const users = [
  { name: "Alex Morgan", handle: "@alexmorgan", joined: "Joined 2 months ago", avatar: "/placeholder.svg" },
  { name: "Terry Wilson", handle: "@terrywilson", joined: "Joined 1 month ago", avatar: "/placeholder.svg" },
  { name: "Sarah Kim", handle: "@sarahkim", joined: "Joined 2 weeks ago", avatar: "/placeholder.svg" },
];

const UserCountBadge: React.FC<UserCountBadgeProps> = ({ count }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card cursor-pointer group">
          <div className="flex -space-x-2">
            {users.map((user, i) => (
              <Avatar key={i} className="border-2 border-black w-7 h-7 transition-transform group-hover:translate-y-[-2px]">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-medium text-white border-2 border-black transition-transform group-hover:translate-y-[-2px]">
              +
            </div>
          </div>
          <p className="text-sm font-medium text-white">
            <span className="font-bold">{count.toLocaleString()}+</span> users
          </p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 glass-card-dark border-gray-800">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-300">
            Join our fast-growing community of creators
          </p>
          <div className="space-y-3">
            {users.map((user, i) => (
              <div key={i} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.handle} · {user.joined}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-emerald-500 font-medium pt-1">
              And {count.toLocaleString() - users.length}+ others
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserCountBadge;
