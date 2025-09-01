import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mockPosts, mockUsers } from '@/lib/mockData';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, content } = await request.json();
    const post = mockPosts.find(p => p.id === params.id);
    
    if (post) {
      const newComment = {
        id: uuidv4(),
        userId,
        content,
        timestamp: new Date().toISOString()
      };
      
      post.comments.push(newComment);
      
      const commentWithUser = {
        ...newComment,
        user: mockUsers.find(u => u.id === userId)
      };
      
      return NextResponse.json(commentWithUser);
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}