import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { ChatProvider } from '@/contexts/ChatContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chat App - Real-time Messaging',
  description: 'A modern real-time chat application with Socket.IO',
  keywords: ['chat', 'messaging', 'real-time', 'socket.io', 'nextjs'],
  authors: [{ name: 'Chat App Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6366f1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <AuthProvider>
          <SocketProvider>
            <ChatProvider>
              <div className="min-h-full">
                {children}
              </div>
            </ChatProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}