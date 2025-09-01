import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = mockUsers.find(u => u.id === id);
  
  if (user) {
    const friends = user.friends.map(friendId => 
      mockUsers.find(u => u.id === friendId)
    ).filter(Boolean);
    return NextResponse.json(friends);
  } else {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}