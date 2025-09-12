'use client';

import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <ChatLayout />;
}