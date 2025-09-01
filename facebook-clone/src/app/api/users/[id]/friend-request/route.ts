import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockData';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { fromUserId } = await request.json();
    const { id } = await params;
    const targetUser = mockUsers.find(u => u.id === id);
    const fromUser = mockUsers.find(u => u.id === fromUserId);
    
    if (targetUser && fromUser) {
      if (!targetUser.friendRequests.includes(fromUserId)) {
        targetUser.friendRequests.push(fromUserId);
        fromUser.sentRequests.push(id);
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to send friend request' }, { status: 500 });
  }
}