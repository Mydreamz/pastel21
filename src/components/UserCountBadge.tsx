
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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-pastel-500/20 border border-pastel-300/50 shadow-neumorphic cursor-pointer group transition-all duration-300 hover:bg-pastel-500/30 hover:shadow-lg">
          <div className="flex -space-x-2">
            {users.map((user, i) => (
              <Avatar 
                key={i} 
                className="border-2 border-white w-7 h-7 transition-all duration-300 group-hover:translate-y-[-2px] animate-fade-in" 
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-pastel-100 text-pastel-700">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            <div className="w-7 h-7 rounded-full bg-pastel-600 flex items-center justify-center text-xs font-medium text-white border-2 border-white transition-all duration-300 group-hover:translate-y-[-2px] animate-fade-in"
              style={{ animationDelay: `${users.length * 100}ms` }}>
              +
            </div>
          </div>
          <p className="text-sm font-medium text-gray-800 transition-all duration-300 group-hover:scale-105">
            <span className="font-bold">{count.toLocaleString()}+</span> users
          </p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 backdrop-blur-xl bg-white/80 border border-pastel-200/50 shadow-neumorphic rounded-2xl animate-scale-in">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-800 animate-fade-in">
            Join our fast-growing community of creators
          </p>
          <div className="space-y-3">
            {users.map((user, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 animate-fade-in hover:bg-pastel-100/30 rounded-lg p-1 transition-all duration-300" 
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <Avatar className="border border-pastel-200 transition-transform duration-300 hover:scale-110">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-pastel-100 text-pastel-700">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.handle} · {user.joined}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-pastel-700 font-medium pt-1 animate-fade-in" style={{ animationDelay: `${users.length * 150}ms` }}>
              And {count - users.length}+ others
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserCountBadge;
