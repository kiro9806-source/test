'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import { formatDistanceToNow } from 'date-fns';
import { Search, Edit, Send, Phone, Video, Info } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface ConversationListItem {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  otherParticipant: User;
}

export default function ConversationPage() {
  const params = useParams();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUserId = params.id as string;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchConversations();
      if (otherUserId) {
        fetchConversation();
        fetchOtherUser();
      }
    }
  }, [user, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/conversations/${user?.id}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/conversations/${user?.id}/${otherUserId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentConversation(data);
      } else {
        // No existing conversation
        setCurrentConversation({
          id: '',
          participants: [user?.id || '', otherUserId],
          messages: []
        });
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherUser = async () => {
    try {
      const response = await fetch(`/api/users/${otherUserId}`);
      const data = await response.json();
      setOtherUser(data);
    } catch (error) {
      console.error('Error fetching other user:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const response = await fetch(`/api/conversations/${user.id}/${otherUserId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      const messageData = await response.json();
      
      // Update current conversation
      setCurrentConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, messageData]
      } : null);

      setNewMessage('');
      fetchConversations(); // Refresh conversations list
    } catch (error) {
      console.error('Error sending message:', error);
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
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.otherParticipant.id}`}
                  className={`flex items-center space-x-3 p-4 hover:bg-gray-50 border-b border-gray-100 ${
                    conversation.otherParticipant.id === otherUserId ? 'bg-blue-50' : ''
                  }`}
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
              ))}
            </div>
          </div>

          {/* Conversation View */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {currentConversation && otherUser ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
                      <p className="text-sm text-green-600">Active now</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Video className="w-5 h-5 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Info className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentConversation.messages.length === 0 ? (
                    <div className="text-center text-gray-600 py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    currentConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.senderId === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === user?.id
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Loading conversation...</h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}