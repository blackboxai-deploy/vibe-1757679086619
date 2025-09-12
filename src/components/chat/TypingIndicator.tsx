'use client';

import React from 'react';
import { TypingUser } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  typingUsers, 
  className = '' 
}) => {
  const { user: currentUser } = useAuth();
  
  // Filter out current user from typing indicators
  const filteredTypingUsers = typingUsers.filter(
    user => user.userId !== currentUser?.id
  );

  if (filteredTypingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    const count = filteredTypingUsers.length;
    
    if (count === 1) {
      return `${filteredTypingUsers[0].username} is typing`;
    } else if (count === 2) {
      return `${filteredTypingUsers[0].username} and ${filteredTypingUsers[1].username} are typing`;
    } else {
      return `${filteredTypingUsers[0].username} and ${count - 1} others are typing`;
    }
  };

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Typing animation dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></div>
        </div>
        
        {/* Typing text */}
        <p className="text-sm text-muted-foreground italic">
          {getTypingText()}...
        </p>
      </div>
    </div>
  );
};

export default TypingIndicator;