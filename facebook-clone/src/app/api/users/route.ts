import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(mockUsers);
}