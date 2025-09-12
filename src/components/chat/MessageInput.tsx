'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';

interface MessageInputProps {
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ className = '' }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, startTyping, stopTyping, isConnected } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicators
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      startTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        stopTyping();
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !isConnected) return;

    // Send the message
    sendMessage(message.trim());
    setMessage('');
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      stopTyping();
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Focus back to input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`border-t bg-background/50 backdrop-blur-sm ${className}`}>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder={
                isConnected 
                  ? "Type your message..." 
                  : "Connecting..."
              }
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={!isConnected}
              className="min-h-[44px] resize-none py-3 px-4 text-sm"
              maxLength={1000}
              autoComplete="off"
            />
            
            {/* Character count (shown when approaching limit) */}
            {message.length > 800 && (
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {message.length}/1000 characters
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={!message.trim() || !isConnected}
            className="min-h-[44px] px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <span className="text-lg">📤</span>
            <span className="ml-1 hidden sm:inline">Send</span>
          </Button>
        </form>
        
        {/* Connection status */}
        {!isConnected && (
          <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            <span>Disconnected - Trying to reconnect...</span>
          </div>
        )}
        
        {/* Helpful hints */}
        <div className="mt-2 text-xs text-muted-foreground text-center">
          <p>Press Enter to send • Shift+Enter for new line • Max 1000 characters</p>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;