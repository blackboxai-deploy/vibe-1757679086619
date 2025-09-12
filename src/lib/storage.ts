import { User, Message } from '@/types/chat';

const STORAGE_KEYS = {
  USER: 'chat_user',
  MESSAGES: 'chat_messages',
  THEME: 'chat_theme',
} as const;

// User storage
export const saveUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const removeStoredUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// Messages storage
export const saveMessages = (messages: Message[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }
};

export const getStoredMessages = (): Message[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const messagesData = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return messagesData ? JSON.parse(messagesData) : [];
  } catch (error) {
    console.error('Error parsing stored messages:', error);
    return [];
  }
};

// Theme storage
export const saveTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};

export const getStoredTheme = (): 'light' | 'dark' | null => {
  if (typeof window === 'undefined') return null;
  
  const theme = localStorage.getItem(STORAGE_KEYS.THEME);
  return theme as 'light' | 'dark' | null;
};

// Avatar generation
export const generateAvatarUrl = (username: string): string => {
  const colors = [
    'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FECA57',
    'FF9FF3', 'F38BA8', 'A8DADC', 'F1C0E8', 'CFBAF0'
  ];
  
  const color = colors[username.length % colors.length];
  const initials = username
    .split(' ')
    .map(name => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  
  return `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4af43eb8-82d4-4bbd-b959-b03b303ffbd6.png}/FFFFFF?text=${initials}`;
};

// ID generation
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Time formatting
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
};