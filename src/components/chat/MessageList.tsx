'use client';

import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useChat } from '@/contexts/ChatContext';
import { formatDate } from '@/lib/storage';
import { Message } from '@/types/chat';

interface MessageListProps {
  className?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ className = '' }) => {
  const { messages, typingUsers } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Check if we should show avatar (first message in a sequence from the same user)
  const shouldShowAvatar = (message: Message, index: number, dayMessages: Message[]) => {
    if (message.type === 'system') return false;
    if (index === 0) return true;
    
    const previousMessage = dayMessages[index - 1];
    return previousMessage.userId !== message.userId || 
           previousMessage.type === 'system' ||
           (message.timestamp.getTime() - previousMessage.timestamp.getTime()) > 300000; // 5 minutes
  };

  if (messages.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">💬</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Welcome to the Chat!</h3>
            <p className="text-muted-foreground">
              Start a conversation by typing a message below. 
              Other users will see your messages in real-time.
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✨ Messages are sent instantly</p>
            <p>👥 See who's online in the sidebar</p>
            <p>⌨️ Typing indicators show active conversations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        <div className="py-4">
          {Object.entries(groupedMessages).map(([date, dayMessages]) => {
            const typedDayMessages = dayMessages as Message[];
            return (
              <div key={date} className="mb-6">
                {/* Date separator */}
                <div className="flex items-center my-6">
                  <Separator className="flex-1" />
                  <div className="px-4">
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border">
                      {date}
                    </span>
                  </div>
                  <Separator className="flex-1" />
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-1">
                  {typedDayMessages.map((message, index) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      showAvatar={shouldShowAvatar(message, index, typedDayMessages)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Typing indicators */}
          {typingUsers.length > 0 && (
            <TypingIndicator typingUsers={typingUsers} className="mb-4" />
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;