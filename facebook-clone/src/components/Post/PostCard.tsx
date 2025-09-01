'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = user ? post.likes.includes(user.id) : false;

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* Post header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Post content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post image */}
      {post.image && (
        <div className="px-0">
          <img
            src={post.image}
            alt="Post content"
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Like and comment counts */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          {post.likes.length > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-2 h-2 text-white fill-current" />
              </div>
              <span>{post.likes.length}</span>
            </div>
          )}
        </div>
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
              isLiked ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">Like</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Comment</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Share className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-200">
          {/* Existing comments */}
          <div className="space-y-3 mt-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-2">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="font-semibold text-sm text-gray-900">{comment.user.name}</p>
                    <p className="text-sm text-gray-900">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-3">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add comment */}
          <form onSubmit={handleComment} className="flex space-x-2 mt-3">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}