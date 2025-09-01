import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = mockUsers.find(u => u.id === params.id);
  
  if (user) {
    const friends = user.friends.map(friendId => 
      mockUsers.find(u => u.id === friendId)
    ).filter(Boolean);
    return NextResponse.json(friends);
  } else {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}