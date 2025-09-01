'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import { UserPlus, MessageCircle, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  friends: string[];
}

export default function FriendsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchFriendsData();
    }
  }, [user]);

  const fetchFriendsData = async () => {
    try {
      // Fetch friends
      const friendsResponse = await fetch(`/api/users/${user?.id}/friends`);
      const friendsData = await friendsResponse.json();
      setFriends(friendsData);

      // Fetch all users to get friend requests and suggestions
      const usersResponse = await fetch('/api/users');
      const allUsers = await usersResponse.json();

      // Filter friend requests
      const requests = allUsers.filter((u: User) => 
        user?.friendRequests.includes(u.id)
      );
      setFriendRequests(requests);

      // Filter suggestions (users who are not friends and haven't sent/received requests)
      const suggestions = allUsers.filter((u: User) => 
        u.id !== user?.id &&
        !user?.friends.includes(u.id) &&
        !user?.friendRequests.includes(u.id) &&
        !user?.sentRequests.includes(u.id)
      ).slice(0, 6);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching friends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFriend = async (fromUserId: string) => {
    try {
      await fetch(`/api/users/${user?.id}/accept-friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fromUserId }),
      });
      
      fetchFriendsData(); // Refresh data
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleSendFriendRequest = async (toUserId: string) => {
    try {
      await fetch(`/api/users/${toUserId}/friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fromUserId: user?.id }),
      });
      
      // Remove from suggestions
      setSuggestions(prev => prev.filter(u => u.id !== toUserId));
    } catch (error) {
      console.error('Error sending friend request:', error);
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
    <MainLayout>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Friends</h1>

        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Friend Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friendRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={request.avatar}
                    alt={request.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-center text-gray-900 mb-1">{request.name}</h3>
                  <p className="text-sm text-gray-500 text-center mb-3">{request.location}</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAcceptFriend(request.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Accept
                    </button>
                    <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friend Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">People You May Know</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={suggestion.avatar}
                    alt={suggestion.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-center text-gray-900 mb-1">{suggestion.name}</h3>
                  <p className="text-sm text-gray-500 text-center mb-3">{suggestion.location}</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSendFriendRequest(suggestion.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add Friend</span>
                    </button>
                    <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center space-x-2">
                      <X className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Friends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Friends ({friends.length})</h2>
          {friends.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No friends yet. Start connecting with people!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <div key={friend.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-center text-gray-900 mb-1">{friend.name}</h3>
                  <p className="text-sm text-gray-500 text-center mb-3">{friend.location}</p>
                  <div className="space-y-2">
                    <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}