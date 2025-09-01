'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Bell, 
  Search,
  Menu,
  LogOut
} from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              facebook
            </Link>
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Facebook"
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Center navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 text-blue-600"
            >
              <Home className="w-6 h-6" />
            </Link>
            <Link 
              href="/friends" 
              className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600"
            >
              <Users className="w-6 h-6" />
            </Link>
            <Link 
              href="/messages" 
              className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600"
            >
              <MessageCircle className="w-6 h-6" />
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <Menu className="w-4 h-4 text-gray-600" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    href={`/profile/${user.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    View Profile
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}