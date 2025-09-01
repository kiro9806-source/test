'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import PostCard from '@/components/Post/PostCard';
import { Camera, MapPin, Calendar, UserPlus, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  location: string;
  joinDate: string;
  friends: string[];
  friendRequests: string[];
  sentRequests: string[];
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: string[];
  comments: Comment[];
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser, isLoading } = useAuth();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const userId = params.id as string;
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  useEffect(() => {
    if (currentUser && userId) {
      fetchProfileData();
    }
  }, [currentUser, userId]);

  const fetchProfileData = async () => {
    try {
      // Fetch user profile
      const userResponse = await fetch(`/api/users/${userId}`);
      const userData = await userResponse.json();
      setProfileUser(userData);

      // Fetch user's posts
      const postsResponse = await fetch(`/api/posts/user/${userId}`);
      const postsData = await postsResponse.json();
      setPosts(postsData);

      // Fetch user's friends
      const friendsResponse = await fetch(`/api/users/${userId}/friends`);
      const friendsData = await friendsResponse.json();
      setFriends(friendsData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      const data = await response.json();
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: data.likes }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.id, content }),
      });

      const newComment = await response.json();
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ));
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!currentUser || !profileUser) return;

    try {
      await fetch(`/api/users/${profileUser.id}/friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fromUserId: currentUser.id }),
      });
      
      // Update local state
      setProfileUser(prev => prev ? {
        ...prev,
        friendRequests: [...prev.friendRequests, currentUser.id]
      } : null);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  if (isLoading || loadingProfile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!profileUser) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-xl text-gray-600">User not found</div>
        </div>
      </MainLayout>
    );
  }

  const isFriend = currentUser?.friends.includes(profileUser.id);
  const hasSentRequest = currentUser?.sentRequests.includes(profileUser.id);
  const hasReceivedRequest = currentUser?.friendRequests.includes(profileUser.id);

  return (
    <MainLayout showRightPanel={false}>
      <div className="max-w-4xl mx-auto">
        {/* Cover Photo and Profile Info */}
        <div className="bg-white rounded-b-lg shadow-sm">
          {/* Cover Photo */}
          <div className="relative h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg overflow-hidden">
            <img
              src={profileUser.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {isOwnProfile && (
              <button className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Edit Cover Photo</span>
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-20">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Name and Actions */}
              <div className="flex-1 mt-4 md:mt-0">
                <h1 className="text-3xl font-bold text-gray-900">{profileUser.name}</h1>
                <p className="text-gray-600 mt-1">{friends.length} friends</p>
                
                {!isOwnProfile && (
                  <div className="flex space-x-3 mt-4">
                    {isFriend ? (
                      <>
                        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300">
                          Friends
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                        </button>
                      </>
                    ) : hasReceivedRequest ? (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                        Accept Friend Request
                      </button>
                    ) : hasSentRequest ? (
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium">
                        Friend Request Sent
                      </button>
                    ) : (
                      <button
                        onClick={handleSendFriendRequest}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Friend</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bio and Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
                <p className="text-gray-700 mb-4">{profileUser.bio}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Lives in {profileUser.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDistanceToNow(new Date(profileUser.joinDate), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              {/* Friends Preview */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Friends ({friends.length})
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {friends.slice(0, 9).map((friend) => (
                    <div key={friend.id} className="text-center">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-16 h-16 rounded-lg object-cover mx-auto"
                      />
                      <p className="text-xs text-gray-700 mt-1 truncate">{friend.name}</p>
                    </div>
                  ))}
                </div>
                {friends.length > 9 && (
                  <button className="text-blue-600 text-sm hover:underline mt-2">
                    See all friends
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
          </div>
          
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No posts yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}