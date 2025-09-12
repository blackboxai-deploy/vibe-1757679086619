'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: any | null;
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

// Mock socket for demo purposes
class MockSocket {
  private eventHandlers: { [key: string]: Function[] } = {};
  private isConnectedState = false;
  
  constructor() {
    // Simulate connection after a short delay
    setTimeout(() => {
      this.isConnectedState = true;
      this.emit('connect');
    }, 1000);
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  off(event: string, handler?: Function) {
    if (!this.eventHandlers[event]) return;
    
    if (handler) {
      const index = this.eventHandlers[event].indexOf(handler);
      if (index > -1) {
        this.eventHandlers[event].splice(index, 1);
      }
    } else {
      delete this.eventHandlers[event];
    }
  }

  emit(event: string, data?: any) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }

  get connected() {
    return this.isConnectedState;
  }

  disconnect() {
    this.isConnectedState = false;
    this.emit('disconnect');
  }
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<MockSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');

  useEffect(() => {
    if (isAuthenticated && user) {
      // Create mock socket when user is authenticated
      const mockSocket = new MockSocket();
      setSocket(mockSocket);

      // Set up connection event handlers
      const handleConnect = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        console.log('🔗 Mock Socket connected');
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        console.log('❌ Mock Socket disconnected');
      };

      // Attach event listeners
      mockSocket.on('connect', handleConnect);
      mockSocket.on('disconnect', handleDisconnect);

      // Cleanup function
      return () => {
        mockSocket.off('connect', handleConnect);
        mockSocket.off('disconnect', handleDisconnect);
        mockSocket.disconnect();
      };
    } else {
      // Clean up socket when user is not authenticated
      if (socket) {
        socket.disconnect();
      }
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      // Return empty cleanup function
      return () => {};
    }
  }, [isAuthenticated, user, socket]);

  const value: SocketContextType = {
    socket,
    isConnected,
    connectionStatus,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;