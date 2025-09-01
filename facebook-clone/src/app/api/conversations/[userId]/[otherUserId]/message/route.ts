import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mockConversations, mockUsers } from '@/lib/mockData';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string; otherUserId: string } }
) {
  try {
    const { content } = await request.json();
    let conversation = mockConversations.find(conv =>
      conv.participants.includes(params.userId) &&
      conv.participants.includes(params.otherUserId)
    );
    
    if (!conversation) {
      conversation = {
        id: uuidv4(),
        participants: [params.userId, params.otherUserId],
        lastMessage: content,
        lastMessageTime: new Date().toISOString(),
        messages: []
      };
      mockConversations.push(conversation);
    }
    
    const newMessage = {
      id: uuidv4(),
      senderId: params.userId,
      content,
      timestamp: new Date().toISOString()
    };
    
    conversation.messages.push(newMessage);
    conversation.lastMessage = content;
    conversation.lastMessageTime = newMessage.timestamp;
    
    const messageWithUser = {
      ...newMessage,
      user: mockUsers.find(u => u.id === params.userId)
    };
    
    return NextResponse.json(messageWithUser);
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}