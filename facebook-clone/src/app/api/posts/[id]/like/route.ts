import { NextRequest, NextResponse } from 'next/server';
import { mockPosts } from '@/lib/mockData';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    const post = mockPosts.find(p => p.id === params.id);
    
    if (post) {
      const likeIndex = post.likes.indexOf(userId);
      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
      } else {
        post.likes.push(userId);
      }
      return NextResponse.json({ likes: post.likes });
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 });
  }
}