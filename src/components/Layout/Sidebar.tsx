'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Bookmark,
  Calendar,
  Clock,
  Users2,
  Store
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const menuItems = [
    { icon: Home, label: 'News Feed', href: '/', active: true },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: Bookmark, label: 'Saved', href: '/saved' },
    { icon: Users2, label: 'Groups', href: '/groups' },
    { icon: Store, label: 'Marketplace', href: '/marketplace' },
    { icon: Calendar, label: 'Events', href: '/events' },
    { icon: Clock, label: 'Memories', href: '/memories' },
  ];

  return (
    <aside className="hidden lg:block w-64 h-screen sticky top-14 bg-white">
      <div className="p-4 space-y-2">
        {/* User profile link */}
        <Link
          href={`/profile/${user.id}`}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-gray-900">{user.name}</span>
        </Link>

        {/* Menu items */}
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
          >
            <item.icon className="w-6 h-6" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        <hr className="my-4" />

        {/* Shortcuts section */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-2">
            Your Shortcuts
          </h3>
          <Link
            href="/groups/1"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <span className="text-sm">Developer Community</span>
          </Link>
          <Link
            href="/groups/2"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm">Photography Club</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}