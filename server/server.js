const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { users, posts, conversations, notifications } = require('./data/mockData');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for demo purposes)
let mockUsers = [...users];
let mockPosts = [...posts];
let mockConversations = [...conversations];
let mockNotifications = [...notifications];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = mockUsers.find(u => u.email === email);
  
  if (user) {
    res.json({ success: true, user });
  } else {
    // Create a new user for demo purposes
    const newUser = {
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
    mockUsers.push(newUser);
    res.json({ success: true, user: newUser });
  }
});

// User endpoints
app.get('/api/users', (req, res) => {
  res.json(mockUsers);
});

app.get('/api/users/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Posts endpoints
app.get('/api/posts', (req, res) => {
  // Get posts with user information
  const postsWithUsers = mockPosts.map(post => ({
    ...post,
    user: mockUsers.find(u => u.id === post.userId),
    comments: post.comments.map(comment => ({
      ...comment,
      user: mockUsers.find(u => u.id === comment.userId)
    }))
  })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json(postsWithUsers);
});

app.get('/api/posts/user/:userId', (req, res) => {
  const userPosts = mockPosts
    .filter(post => post.userId === req.params.userId)
    .map(post => ({
      ...post,
      user: mockUsers.find(u => u.id === post.userId),
      comments: post.comments.map(comment => ({
        ...comment,
        user: mockUsers.find(u => u.id === comment.userId)
      }))
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json(userPosts);
});

app.post('/api/posts', (req, res) => {
  const { userId, content, image } = req.body;
  const newPost = {
    id: uuidv4(),
    userId,
    content,
    image: image || null,
    timestamp: new Date().toISOString(),
    likes: [],
    comments: []
  };
  
  mockPosts.unshift(newPost);
  
  const postWithUser = {
    ...newPost,
    user: mockUsers.find(u => u.id === userId),
    comments: []
  };
  
  res.json(postWithUser);
});

app.post('/api/posts/:id/like', (req, res) => {
  const { userId } = req.body;
  const post = mockPosts.find(p => p.id === req.params.id);
  
  if (post) {
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }
    res.json({ likes: post.likes });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts/:id/comment', (req, res) => {
  const { userId, content } = req.body;
  const post = mockPosts.find(p => p.id === req.params.id);
  
  if (post) {
    const newComment = {
      id: uuidv4(),
      userId,
      content,
      timestamp: new Date().toISOString()
    };
    
    post.comments.push(newComment);
    
    const commentWithUser = {
      ...newComment,
      user: mockUsers.find(u => u.id === userId)
    };
    
    res.json(commentWithUser);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Friends endpoints
app.get('/api/users/:id/friends', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (user) {
    const friends = user.friends.map(friendId => 
      mockUsers.find(u => u.id === friendId)
    ).filter(Boolean);
    res.json(friends);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/:id/friend-request', (req, res) => {
  const { fromUserId } = req.body;
  const targetUser = mockUsers.find(u => u.id === req.params.id);
  const fromUser = mockUsers.find(u => u.id === fromUserId);
  
  if (targetUser && fromUser) {
    if (!targetUser.friendRequests.includes(fromUserId)) {
      targetUser.friendRequests.push(fromUserId);
      fromUser.sentRequests.push(req.params.id);
    }
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/:id/accept-friend', (req, res) => {
  const { fromUserId } = req.body;
  const user = mockUsers.find(u => u.id === req.params.id);
  const fromUser = mockUsers.find(u => u.id === fromUserId);
  
  if (user && fromUser) {
    // Remove from friend requests
    user.friendRequests = user.friendRequests.filter(id => id !== fromUserId);
    fromUser.sentRequests = fromUser.sentRequests.filter(id => id !== req.params.id);
    
    // Add to friends
    if (!user.friends.includes(fromUserId)) {
      user.friends.push(fromUserId);
      fromUser.friends.push(req.params.id);
    }
    
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Messages endpoints
app.get('/api/conversations/:userId', (req, res) => {
  const userConversations = mockConversations
    .filter(conv => conv.participants.includes(req.params.userId))
    .map(conv => ({
      ...conv,
      otherParticipant: mockUsers.find(u => 
        u.id === conv.participants.find(id => id !== req.params.userId)
      )
    }))
    .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  
  res.json(userConversations);
});

app.get('/api/conversations/:userId/:otherUserId', (req, res) => {
  const conversation = mockConversations.find(conv =>
    conv.participants.includes(req.params.userId) &&
    conv.participants.includes(req.params.otherUserId)
  );
  
  if (conversation) {
    const conversationWithUsers = {
      ...conversation,
      messages: conversation.messages.map(msg => ({
        ...msg,
        user: mockUsers.find(u => u.id === msg.senderId)
      }))
    };
    res.json(conversationWithUsers);
  } else {
    res.status(404).json({ error: 'Conversation not found' });
  }
});

app.post('/api/conversations/:userId/:otherUserId/message', (req, res) => {
  const { content } = req.body;
  let conversation = mockConversations.find(conv =>
    conv.participants.includes(req.params.userId) &&
    conv.participants.includes(req.params.otherUserId)
  );
  
  if (!conversation) {
    conversation = {
      id: uuidv4(),
      participants: [req.params.userId, req.params.otherUserId],
      lastMessage: content,
      lastMessageTime: new Date().toISOString(),
      messages: []
    };
    mockConversations.push(conversation);
  }
  
  const newMessage = {
    id: uuidv4(),
    senderId: req.params.userId,
    content,
    timestamp: new Date().toISOString()
  };
  
  conversation.messages.push(newMessage);
  conversation.lastMessage = content;
  conversation.lastMessageTime = newMessage.timestamp;
  
  const messageWithUser = {
    ...newMessage,
    user: mockUsers.find(u => u.id === req.params.userId)
  };
  
  res.json(messageWithUser);
});

// Notifications endpoints
app.get('/api/notifications/:userId', (req, res) => {
  const userNotifications = mockNotifications
    .filter(notif => notif.userId === req.params.userId)
    .map(notif => ({
      ...notif,
      fromUser: mockUsers.find(u => u.id === notif.fromUserId)
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json(userNotifications);
});

// Reset data endpoint for testing
app.post('/api/reset', (req, res) => {
  mockUsers = [...users];
  mockPosts = [...posts];
  mockConversations = [...conversations];
  mockNotifications = [...notifications];
  res.json({ success: true, message: 'Data reset successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});