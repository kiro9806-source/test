import { NextRequest, NextResponse } from 'next/server';
import { mockConversations, mockUsers } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userConversations = mockConversations
    .filter(conv => conv.participants.includes(params.userId))
    .map(conv => ({
      ...conv,
      otherParticipant: mockUsers.find(u => 
        u.id === conv.participants.find(id => id !== params.userId)
      )
    }))
    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  
  return NextResponse.json(userConversations);
}