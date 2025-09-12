'use client';

import React from 'react';
import { Message } from '@/types/chat';
import { UserAvatar } from '@/components/users/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { formatTime, generateAvatarUrl } from '@/lib/storage';

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  showAvatar = true,
  className = '' 
}) => {
  const { user: currentUser } = useAuth();
  const isOwnMessage = currentUser?.id === message.userId;
  const isSystemMessage = message.type === 'system';

  // Create a temporary user object for avatar display
  const messageUser = {
    id: message.userId,
    username: message.username,
    avatar: generateAvatarUrl(message.username),
    isOnline: true,
    lastSeen: new Date(),
  };

  if (isSystemMessage) {
    return (
      <div className={`flex justify-center my-4 ${className}`}>
        <div className="bg-muted px-3 py-2 rounded-full">
          <p className="text-xs text-muted-foreground text-center">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end space-x-2 mb-4 ${
      isOwnMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row'
    } ${className}`}>
      {/* Avatar */}
      {showAvatar && !isOwnMessage && (
        <div className="flex-shrink-0">
          <UserAvatar user={messageUser} size="sm" />
        </div>
      )}
      
      {/* Message Content */}
      <div className={`flex flex-col max-w-xs lg:max-w-md xl:max-w-lg ${
        isOwnMessage ? 'items-end' : 'items-start'
      }`}>
        {/* Username and timestamp */}
        {!isOwnMessage && showAvatar && (
          <div className="flex items-center space-x-2 mb-1 px-1">
            <span className="text-xs font-medium text-muted-foreground">
              {message.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}
        
        {/* Message bubble */}
        <div className={`relative px-4 py-2 rounded-2xl shadow-sm ${
          isOwnMessage
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-muted-foreground rounded-bl-md'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          {/* Timestamp for own messages */}
          {isOwnMessage && (
            <p className="text-xs opacity-70 mt-1 text-right">
              {formatTime(message.timestamp)}
            </p>
          )}
        </div>
        
        {/* Message reactions (placeholder for future feature) */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 px-1">
            {message.reactions.map((reaction, index) => (
              <div 
                key={index}
                className="bg-background border rounded-full px-2 py-1 text-xs flex items-center space-x-1"
              >
                <span>{reaction.emoji}</span>
                <span className="text-muted-foreground">1</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Spacer for own messages to maintain consistent spacing */}
      {isOwnMessage && (
        <div className="flex-shrink-0 w-8" />
      )}
    </div>
  );
};

export default MessageBubble;