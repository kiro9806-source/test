import { NextRequest, NextResponse } from 'next/server';
import { mockConversations, mockUsers } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; otherUserId: string } }
) {
  const conversation = mockConversations.find(conv =>
    conv.participants.includes(params.userId) &&
    conv.participants.includes(params.otherUserId)
  );
  
  if (conversation) {
    const conversationWithUsers = {
      ...conversation,
      messages: conversation.messages.map(msg => ({
        ...msg,
        user: mockUsers.find(u => u.id === msg.senderId)
      }))
    };
    return NextResponse.json(conversationWithUsers);
  } else {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }
}