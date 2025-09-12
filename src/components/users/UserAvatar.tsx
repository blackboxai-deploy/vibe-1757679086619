'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/chat';

interface UserAvatarProps {
  user: User;
  showStatus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  showStatus = false, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`relative ${className}`}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage 
          src={user.avatar} 
          alt={`${user.username}'s avatar`}
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium">
          {getInitials(user.username)}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <div className="absolute -bottom-1 -right-1">
          <Badge 
            variant={user.isOnline ? "default" : "secondary"} 
            className={`h-3 w-3 p-0 rounded-full border-2 border-background ${
              user.isOnline 
                ? 'bg-green-500 hover:bg-green-500' 
                : 'bg-gray-400 hover:bg-gray-400'
            }`}
          >
            <span className="sr-only">
              {user.isOnline ? 'Online' : 'Offline'}
            </span>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;