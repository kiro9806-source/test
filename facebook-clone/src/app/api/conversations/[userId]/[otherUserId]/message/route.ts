import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mockConversations, mockUsers } from '@/lib/mockData';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; otherUserId: string }> }
) {
  try {
    const { content } = await request.json();
    const { userId, otherUserId } = await params;
    let conversation = mockConversations.find(conv =>
      conv.participants.includes(userId) &&
      conv.participants.includes(otherUserId)
    );
    
    if (!conversation) {
      conversation = {
        id: uuidv4(),
        participants: [userId, otherUserId],
        lastMessage: content,
        lastMessageTime: new Date().toISOString(),
        messages: []
      };
      mockConversations.push(conversation);
    }
    
    const newMessage = {
      id: uuidv4(),
      senderId: userId,
      content,
      timestamp: new Date().toISOString()
    };
    
    conversation.messages.push(newMessage);
    conversation.lastMessage = content;
    conversation.lastMessageTime = newMessage.timestamp;
    
    const messageWithUser = {
      ...newMessage,
      user: mockUsers.find(u => u.id === userId)
    };
    
    return NextResponse.json(messageWithUser);
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}