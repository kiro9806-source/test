import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mockUsers } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    let user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      // Create a new user for demo purposes
      user = {
        id: uuidv4(),
        name: email.split('@')[0],
        email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
        bio: 'New to the platform!',
        location: 'Unknown',
        joinDate: new Date().toISOString(),
        friends: [],
        friendRequests: [],
        sentRequests: []
      };
      mockUsers.push(user);
    }
    
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}