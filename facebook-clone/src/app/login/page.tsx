'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const success = await login(email);
    
    if (success) {
      router.push('/');
    } else {
      alert('Login failed. Please try again.');
    }
    setIsLoading(false);
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">facebook</h1>
          <p className="text-xl text-gray-600">
            Connect with friends and the world around you on Facebook.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Quick login options:</p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('john@example.com')}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded"
              >
                John Doe (john@example.com)
              </button>
              <button
                onClick={() => quickLogin('jane@example.com')}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded"
              >
                Jane Smith (jane@example.com)
              </button>
              <button
                onClick={() => quickLogin('mike@example.com')}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded"
              >
                Mike Johnson (mike@example.com)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}