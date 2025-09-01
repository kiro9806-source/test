'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  avatar: string;
}

export default function RightPanel() {
  const { user } = useAuth();
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      fetchOnlineFriends();
      fetchFriendRequests();
    }
  }, [user]);

  const fetchOnlineFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user?.id}/friends`);
      const friends = await response.json();
      // Simulate some friends being online
      const online = friends.slice(0, 3);
      setOnlineFriends(online);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users');
      const allUsers = await response.json();
      const requests = allUsers.filter((u: any) => 
        user?.friendRequests.includes(u.id)
      );
      setFriendRequests(requests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const handleAcceptFriend = async (fromUserId: string) => {
    try {
      await fetch(`http://localhost:3001/api/users/${user?.id}/accept-friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fromUserId }),
      });
      
      // Update local state
      setFriendRequests(prev => prev.filter(req => req.id !== fromUserId));
      fetchOnlineFriends(); // Refresh friends list
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  if (!user) return null;

  return (
    <aside className="hidden xl:block w-80 h-screen sticky top-14 bg-white p-4 space-y-6">
      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Friend Requests</h3>
          <div className="space-y-3">
            {friendRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={request.avatar}
                    alt={request.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{request.name}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptFriend(request.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Online Friends */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contacts</h3>
        <div className="space-y-2">
          {onlineFriends.map((friend) => (
            <Link
              key={friend.id}
              href={`/messages/${friend.id}`}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{friend.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sponsored content */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Sponsored
        </h3>
        <div className="space-y-3">
          <div className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop"
              alt="Ad"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Learn Web Development</p>
              <p className="text-xs text-gray-500">codecademy.com</p>
            </div>
          </div>
          <div className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=60&h=60&fit=crop"
              alt="Ad"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Best Coffee Deals</p>
              <p className="text-xs text-gray-500">localcoffee.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}