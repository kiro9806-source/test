import { NextRequest, NextResponse } from 'next/server';
import { mockConversations, mockUsers } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const userConversations = mockConversations
    .filter(conv => conv.participants.includes(userId))
    .map(conv => ({
      ...conv,
      otherParticipant: mockUsers.find(u => 
        u.id === conv.participants.find(id => id !== userId)
      )
    }))
    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  
  return NextResponse.json(userConversations);
}