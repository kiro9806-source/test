import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockData';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { fromUserId } = await request.json();
    const { id } = await params;
    const user = mockUsers.find(u => u.id === id);
    const fromUser = mockUsers.find(u => u.id === fromUserId);
    
    if (user && fromUser) {
      // Remove from friend requests
      user.friendRequests = user.friendRequests.filter(id => id !== fromUserId);
      fromUser.sentRequests = fromUser.sentRequests.filter(reqId => reqId !== id);
      
      // Add to friends
      if (!user.friends.includes(fromUserId)) {
        user.friends.push(fromUserId);
        fromUser.friends.push(id);
      }
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to accept friend request' }, { status: 500 });
  }
}