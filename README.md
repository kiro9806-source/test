# Facebook Clone

A full-stack Facebook-like social media application built with Next.js, Express.js, and mock data.

## Features

- **Authentication**: Simple email-based login (no password required for demo)
- **News Feed**: View and create posts, like and comment on posts
- **Profile Pages**: View user profiles with posts, friends, and bio information
- **Friends System**: Send/accept friend requests, view friends list
- **Messaging**: Real-time-like messaging between users
- **Responsive Design**: Facebook-like UI that works on desktop and mobile

## Tech Stack

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **date-fns** for date formatting

### Backend
- **Express.js** server
- **CORS** enabled for cross-origin requests
- **UUID** for generating unique IDs
- **In-memory data storage** (resets on server restart)

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd facebook-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application** (runs both frontend and backend)
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Alternative: Run Frontend and Backend Separately

If you prefer to run them separately:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev:client
```

## Usage

1. **Login**: Visit http://localhost:3000/login
   - Use any email address (e.g., `john@example.com`)
   - Or click one of the quick login options

2. **Explore Features**:
   - **Home**: View news feed, create posts, like and comment
   - **Profile**: Click on user names to view profiles
   - **Friends**: Navigate to friends page to see friend requests and suggestions
   - **Messages**: Chat with friends (mock conversations)

## Mock Data

The application comes with pre-seeded mock data including:
- 7 sample users with profiles and avatars
- Sample posts with images, likes, and comments
- Friend connections and requests
- Mock conversations and messages

### Reset Data

To reset all data to initial state:
```bash
curl -X POST http://localhost:3001/api/reset
```

## Project Structure

```
facebook-clone/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── login/             # Login page
│   │   ├── profile/[id]/      # Dynamic profile pages
│   │   ├── friends/           # Friends list page
│   │   ├── messages/          # Messages pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── Layout/            # Layout components
│   │   └── Post/              # Post-related components
│   └── contexts/              # React contexts
├── server/                    # Express.js backend
│   ├── data/                  # Mock data
│   ├── server.js             # Main server file
│   └── package.json          # Server dependencies
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/friends` - Get user's friends
- `POST /api/users/:id/friend-request` - Send friend request
- `POST /api/users/:id/accept-friend` - Accept friend request

### Posts
- `GET /api/posts` - Get all posts (with user info)
- `GET /api/posts/user/:userId` - Get posts by user
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment to post

### Messages
- `GET /api/conversations/:userId` - Get user's conversations
- `GET /api/conversations/:userId/:otherUserId` - Get specific conversation
- `POST /api/conversations/:userId/:otherUserId/message` - Send message

### Utility
- `POST /api/reset` - Reset all data to initial state

## Demo Users

Quick login options available on the login page:
- John Doe (john@example.com)
- Jane Smith (jane@example.com)
- Mike Johnson (mike@example.com)

## Development Notes

- The application uses mock data stored in memory
- Data persists during the session but resets when the server restarts
- No real authentication - any email can be used to login
- Images are sourced from Unsplash for demo purposes
- The UI closely mimics Facebook's design patterns

## Troubleshooting

### Port Issues
If ports 3000 or 3001 are in use:
- Change the frontend port: `npm run dev:client -- -p 3002`
- Change the backend port: Edit `server/server.js` and update the PORT variable

### CORS Issues
Make sure both frontend and backend are running and the backend allows requests from the frontend origin.

### Dependencies
If you encounter dependency issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

## License

This is a demo application for educational purposes.