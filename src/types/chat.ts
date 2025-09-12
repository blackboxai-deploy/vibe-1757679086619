export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  username: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
  typingUsers: TypingUser[];
}

export interface SocketEvents {
  // Client to Server
  join_room: { roomId: string; user: User };
  leave_room: { roomId: string; userId: string };
  send_message: { roomId: string; message: Omit<Message, 'id' | 'timestamp'> };
  start_typing: { roomId: string; user: Pick<User, 'id' | 'username'> };
  stop_typing: { roomId: string; userId: string };
  
  // Server to Client
  user_joined: { user: User };
  user_left: { userId: string };
  new_message: { message: Message };
  user_typing: { user: Pick<User, 'id' | 'username'> };
  user_stopped_typing: { userId: string };
  users_update: { users: User[] };
  connection_status: { status: 'connected' | 'disconnected' | 'reconnecting' };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
}

export interface ChatState {
  currentRoom: ChatRoom | null;
  messages: Message[];
  users: User[];
  typingUsers: TypingUser[];
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}