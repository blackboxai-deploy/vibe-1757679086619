'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from './UserAvatar';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatTime } from '@/lib/storage';

interface UserListProps {
  className?: string;
}

export const UserList: React.FC<UserListProps> = ({ className = '' }) => {
  const { users, connectionStatus } = useChat();
  const { user: currentUser } = useAuth();

  const sortedUsers = users.sort((a, b) => {
    // Current user first, then online users, then offline users
    if (a.id === currentUser?.id) return -1;
    if (b.id === currentUser?.id) return 1;
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    return a.username.localeCompare(b.username);
  });

  const onlineCount = users.filter(user => user.isOnline).length;

  return (
    <div className={`flex flex-col h-full bg-muted/10 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Users</h3>
          <Badge variant="secondary" className="text-xs">
            {onlineCount} online
          </Badge>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center mt-2 text-sm">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'reconnecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-red-500'
          }`} />
          <span className="text-muted-foreground capitalize">
            {connectionStatus}
          </span>
        </div>
      </div>

      {/* User List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {sortedUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">No users online</p>
              <p className="text-xs mt-1">Be the first to join!</p>
            </div>
          ) : (
            sortedUsers.map((user, index) => (
              <div key={user.id}>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <UserAvatar user={user} showStatus size="md" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm truncate">
                        {user.username}
                      </p>
                      {user.id === currentUser?.id && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          You
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {user.isOnline ? (
                        'Active now'
                      ) : (
                        `Last seen ${formatTime(user.lastSeen)}`
                      )}
                    </p>
                  </div>
                </div>
                
                {index < sortedUsers.length - 1 && (
                  <Separator className="my-1 opacity-50" />
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t text-center">
        <p className="text-xs text-muted-foreground">
          💬 Real-time chat powered by Socket.IO
        </p>
      </div>
    </div>
  );
};

export default UserList;