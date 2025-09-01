'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import { formatDistanceToNow } from 'date-fns';
import { Search, Edit } from 'lucide-react';

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  otherParticipant: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function MessagesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/conversations/${user?.id}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showRightPanel={false}>
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-600">
                  No conversations yet. Start chatting with your friends!
                </div>
              ) : (
                conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/messages/${conversation.otherParticipant.id}`}
                    className="flex items-center space-x-3 p-4 hover:bg-gray-50 border-b border-gray-100"
                  >
                    <div className="relative">
                      <img
                        src={conversation.otherParticipant.avatar}
                        alt={conversation.otherParticipant.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.otherParticipant.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Empty state for conversation view */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-600">
                              <div className="w-16 h-16 mx-auto mb-4 text-gray-400 flex items-center justify-center">
                  💬
                </div>
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p>Choose a conversation from the list to start messaging.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}