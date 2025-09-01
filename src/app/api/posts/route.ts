import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mockPosts, mockUsers } from '@/lib/mockData';

export async function GET() {
  // Get posts with user information
  const postsWithUsers = mockPosts.map(post => ({
    ...post,
    user: mockUsers.find(u => u.id === post.userId),
    comments: post.comments.map(comment => ({
      ...comment,
      user: mockUsers.find(u => u.id === comment.userId)
    }))
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return NextResponse.json(postsWithUsers);
}

export async function POST(request: NextRequest) {
  try {
    const { userId, content, image } = await request.json();
    
    const newPost = {
      id: uuidv4(),
      userId,
      content,
      image: image || undefined,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: []
    };
    
    mockPosts.unshift(newPost);
    
    const postWithUser = {
      ...newPost,
      user: mockUsers.find(u => u.id === userId),
      comments: []
    };
    
    return NextResponse.json(postWithUser);
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}