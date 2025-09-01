'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Image, Smile, MapPin } from 'lucide-react';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          content: content.trim(),
        }),
      });

      if (response.ok) {
        setContent('');
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex space-x-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder={`What's on your mind, ${user.name}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
                >
                  <Image className="w-5 h-5" />
                  <span className="text-sm font-medium">Photo/Video</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
                >
                  <Smile className="w-5 h-5" />
                  <span className="text-sm font-medium">Feeling/Activity</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">Check in</span>
                </button>
              </div>
              
              <button
                type="submit"
                disabled={!content.trim() || isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}