import { NextRequest, NextResponse } from 'next/server';
import { mockPosts, mockUsers } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userPosts = mockPosts
    .filter(post => post.userId === params.userId)
    .map(post => ({
      ...post,
      user: mockUsers.find(u => u.id === post.userId),
      comments: post.comments.map(comment => ({
        ...comment,
        user: mockUsers.find(u => u.id === comment.userId)
      }))
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return NextResponse.json(userPosts);
}