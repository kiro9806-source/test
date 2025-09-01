const { v4: uuidv4 } = require('uuid');

// Generate mock users
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
    bio: 'Software developer passionate about technology and innovation.',
    location: 'San Francisco, CA',
    joinDate: '2020-01-15',
    friends: ['2', '3', '4', '5'],
    friendRequests: ['6'],
    sentRequests: ['7']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=300&fit=crop',
    bio: 'Digital marketing specialist and travel enthusiast.',
    location: 'New York, NY',
    joinDate: '2020-03-22',
    friends: ['1', '3', '4'],
    friendRequests: [],
    sentRequests: ['5']
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
    bio: 'Photographer and outdoor adventure lover.',
    location: 'Denver, CO',
    joinDate: '2019-11-08',
    friends: ['1', '2', '4', '5'],
    friendRequests: [],
    sentRequests: []
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=300&fit=crop',
    bio: 'Designer and coffee enthusiast. Always looking for inspiration.',
    location: 'Seattle, WA',
    joinDate: '2021-02-14',
    friends: ['1', '2', '3'],
    friendRequests: [],
    sentRequests: ['6']
  },
  {
    id: '5',
    name: 'Alex Brown',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
    bio: 'Entrepreneur building the future of technology.',
    location: 'Austin, TX',
    joinDate: '2020-07-30',
    friends: ['1', '3'],
    friendRequests: ['2'],
    sentRequests: []
  },
  {
    id: '6',
    name: 'Emma Davis',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=300&fit=crop',
    bio: 'Teacher and lifelong learner. Love reading and hiking.',
    location: 'Portland, OR',
    joinDate: '2021-05-12',
    friends: [],
    friendRequests: ['1'],
    sentRequests: ['4']
  },
  {
    id: '7',
    name: 'David Lee',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
    bio: 'Musician and sound engineer. Always creating something new.',
    location: 'Nashville, TN',
    joinDate: '2019-09-03',
    friends: [],
    friendRequests: ['1'],
    sentRequests: []
  }
];

// Generate mock posts
const posts = [
  {
    id: '1',
    userId: '1',
    content: 'Just finished building an amazing web application! Excited to share it with everyone. 🚀',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: ['2', '3', '4'],
    comments: [
      {
        id: 'c1',
        userId: '2',
        content: 'Looks awesome! Can\'t wait to try it out.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'c2',
        userId: '3',
        content: 'Great work! 👏',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '2',
    userId: '2',
    content: 'Beautiful sunset from my trip to the mountains. Nature never fails to amaze me! 🌅',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: ['1', '3', '5'],
    comments: [
      {
        id: 'c3',
        userId: '1',
        content: 'Absolutely stunning! Where was this taken?',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '3',
    userId: '3',
    content: 'Coffee and code - the perfect combination for a productive morning! ☕️💻',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: ['1', '2', '4', '5'],
    comments: []
  },
  {
    id: '4',
    userId: '4',
    content: 'Working on some new design concepts. Love the creative process! 🎨',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: ['1', '2', '3'],
    comments: [
      {
        id: 'c4',
        userId: '2',
        content: 'Your designs are always so inspiring!',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '5',
    userId: '5',
    content: 'Excited to announce the launch of our new startup! It\'s been an incredible journey. 🚀',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: ['1', '2', '3', '4'],
    comments: [
      {
        id: 'c5',
        userId: '1',
        content: 'Congratulations! Wishing you all the best!',
        timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'c6',
        userId: '3',
        content: 'Amazing news! Can\'t wait to see what you build.',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

// Generate mock messages/conversations
const conversations = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: 'Hey! How are you doing?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'm1',
        senderId: '2',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'm2',
        senderId: '1',
        content: 'I\'m doing great! Just finished working on a new project.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },
      {
        id: 'm3',
        senderId: '2',
        content: 'That sounds exciting! Tell me more about it.',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '2',
    participants: ['1', '3'],
    lastMessage: 'Thanks for the coffee recommendation!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'm4',
        senderId: '1',
        content: 'Have you tried that new coffee shop downtown?',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'm5',
        senderId: '3',
        content: 'Not yet, but I\'ve heard great things about it!',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'm6',
        senderId: '3',
        content: 'Thanks for the coffee recommendation!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '3',
    participants: ['1', '4'],
    lastMessage: 'Let\'s catch up soon!',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'm7',
        senderId: '4',
        content: 'Hey! Long time no see.',
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'm8',
        senderId: '1',
        content: 'I know! How have you been?',
        timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'm9',
        senderId: '4',
        content: 'Let\'s catch up soon!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

// Mock notifications
const notifications = [
  {
    id: '1',
    userId: '1',
    type: 'like',
    fromUserId: '2',
    postId: '1',
    message: 'Jane Smith liked your post',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '2',
    userId: '1',
    type: 'comment',
    fromUserId: '3',
    postId: '1',
    message: 'Mike Johnson commented on your post',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '3',
    userId: '1',
    type: 'friend_request',
    fromUserId: '6',
    message: 'Emma Davis sent you a friend request',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];

module.exports = {
  users,
  posts,
  conversations,
  notifications
};