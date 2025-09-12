'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserList } from '@/components/users/UserList';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';

interface ChatLayoutProps {
  className?: string;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ className = '' }) => {
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const { user, logout } = useAuth();
  const { users, messages, clearMessages } = useChat();

  const onlineCount = users.filter(u => u.isOnline).length;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to leave the chat?')) {
      logout();
    }
  };

  const handleClearMessages = () => {
    if (window.confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
      clearMessages();
    }
  };

  return (
    <div className={`flex h-screen bg-background ${className}`}>
      {/* Desktop Sidebar - Users */}
      <div className="hidden lg:flex lg:w-80 border-r">
        <UserList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <Sheet open={isUserListOpen} onOpenChange={setIsUserListOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <span className="text-sm">👥</span>
                  {onlineCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 text-xs">
                      {onlineCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <UserList />
              </SheetContent>
            </Sheet>

            {/* Chat Title */}
            <div>
              <h1 className="text-lg font-semibold">General Chat</h1>
              <p className="text-sm text-muted-foreground">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* Current User Info */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">
                {user?.username}
              </span>
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearMessages}
              className="hidden sm:inline-flex"
            >
              Clear
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <span className="text-sm">🚪</span>
              <span className="hidden sm:ml-1 sm:inline">Leave</span>
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <MessageList />
        </div>

        {/* Message Input */}
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatLayout;