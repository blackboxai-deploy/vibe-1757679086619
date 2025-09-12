'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Message, User, TypingUser, ChatState, ChatRoom } from '@/types/chat';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { saveMessages, getStoredMessages, generateId } from '@/lib/storage';

const ChatContext = createContext<ChatState & {
  sendMessage: (content: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  clearMessages: () => void;
} | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

const ROOM_ID = 'general'; // For this demo, we'll use a single room

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');

  // Load messages from localStorage on mount
  useEffect(() => {
    const storedMessages = getStoredMessages();
    setMessages(storedMessages);
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  // Join room when socket connects and user is available
  useEffect(() => {
    if (socket && user && isConnected) {
      socket.emit('join_room', { roomId: ROOM_ID, user });
      setConnectionStatus('connected');
      
      // Add some demo users for showcase
      const demoUsers: User[] = [
        {
          id: 'demo-1',
          username: 'Alex Smith',
          avatar: `https://placehold.co/100x100/4ECDC4/FFFFFF?text=AS`,
          isOnline: true,
          lastSeen: new Date(),
        },
        {
          id: 'demo-2',
          username: 'Sarah Johnson',
          avatar: `https://placehold.co/100x100/FF6B6B/FFFFFF?text=SJ`,
          isOnline: true,
          lastSeen: new Date(),
        },
        {
          id: 'demo-3',
          username: 'Mike Chen',
          avatar: `https://placehold.co/100x100/45B7D1/FFFFFF?text=MC`,
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        }
      ];
      
      setUsers([user, ...demoUsers]);
      
      // Add a welcome message
      const welcomeMessage: Message = {
        id: generateId(),
        userId: 'system',
        username: 'System',
        content: `${user.username} joined the chat`,
        timestamp: new Date(),
        type: 'system',
      };
      setMessages(prev => [...prev, welcomeMessage]);
      
    } else if (!isConnected) {
      setConnectionStatus('disconnected');
    }
  }, [socket, user, isConnected]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = ({ user: newUser }: { user: User }) => {
      setUsers(prevUsers => {
        const existingUser = prevUsers.find(u => u.id === newUser.id);
        if (existingUser) {
          return prevUsers.map(u => u.id === newUser.id ? { ...u, isOnline: true } : u);
        }
        return [...prevUsers, newUser];
      });

      // Add system message
      const systemMessage: Message = {
        id: generateId(),
        userId: 'system',
        username: 'System',
        content: `${newUser.username} joined the chat`,
        timestamp: new Date(),
        type: 'system',
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    const handleUserLeft = ({ userId }: { userId: string }) => {
      setUsers(prevUsers => {
        const user = prevUsers.find(u => u.id === userId);
        if (user) {
          const systemMessage: Message = {
            id: generateId(),
            userId: 'system',
            username: 'System',
            content: `${user.username} left the chat`,
            timestamp: new Date(),
            type: 'system',
          };
          setMessages(prev => [...prev, systemMessage]);
        }
        return prevUsers.filter(u => u.id !== userId);
      });
    };

    const handleNewMessage = ({ message }: { message: Message }) => {
      setMessages(prev => [...prev, { ...message, timestamp: new Date(message.timestamp) }]);
    };

    const handleUserTyping = ({ user: typingUser }: { user: Pick<User, 'id' | 'username'> }) => {
      setTypingUsers(prev => {
        const existing = prev.find(u => u.userId === typingUser.id);
        if (existing) return prev;
        
        return [...prev, {
          userId: typingUser.id,
          username: typingUser.username,
          timestamp: new Date(),
        }];
      });

      // Remove typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u.userId !== typingUser.id));
      }, 3000);
    };

    const handleUserStoppedTyping = ({ userId }: { userId: string }) => {
      setTypingUsers(prev => prev.filter(u => u.userId !== userId));
    };

    const handleUsersUpdate = ({ users: updatedUsers }: { users: User[] }) => {
      setUsers(updatedUsers);
    };

    const handleConnectionStatus = ({ status }: { status: 'connected' | 'disconnected' | 'reconnecting' }) => {
      setConnectionStatus(status);
    };

    // Register event listeners
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);
    socket.on('users_update', handleUsersUpdate);
    socket.on('connection_status', handleConnectionStatus);

    // Cleanup
    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
      socket.off('users_update', handleUsersUpdate);
      socket.off('connection_status', handleConnectionStatus);
    };
  }, [socket]);

  // Send message function
  const sendMessage = useCallback((content: string) => {
    if (!socket || !user || !content.trim()) return;

    const newMessage: Message = {
      id: generateId(),
      userId: user.id,
      username: user.username,
      content: content.trim(),
      timestamp: new Date(),
      type: 'text',
    };

    // Add message directly for demo
    setMessages(prev => [...prev, newMessage]);

    // Simulate receiving a demo response after a delay
    if (content.trim().toLowerCase().includes('hello')) {
      setTimeout(() => {
        const botMessage: Message = {
          id: generateId(),
          userId: 'bot',
          username: 'ChatBot',
          content: `Hello ${user.username}! 👋 Welcome to the chat! This is a demo response.`,
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000 + Math.random() * 2000);
    }

    socket.emit('send_message', { roomId: ROOM_ID, message: newMessage });
  }, [socket, user]);

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!socket || !user) return;
    socket.emit('start_typing', { roomId: ROOM_ID, user: { id: user.id, username: user.username } });
  }, [socket, user]);

  const stopTyping = useCallback(() => {
    if (!socket || !user) return;
    socket.emit('stop_typing', { roomId: ROOM_ID, userId: user.id });
  }, [socket, user]);

  // Clear messages function
  const clearMessages = useCallback(() => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chat_messages');
    }
  }, []);

  const value = {
    currentRoom,
    messages,
    users,
    typingUsers,
    isConnected,
    connectionStatus,
    sendMessage,
    startTyping,
    stopTyping,
    clearMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;