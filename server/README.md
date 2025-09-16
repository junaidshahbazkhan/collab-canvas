# Collaborative Canvas Server

A Socket.io server for real-time collaborative canvas functionality.

## Features

- Real-time rectangle creation and movement synchronization
- User connection tracking
- Canvas state persistence (in-memory)
- Automatic cleanup of abandoned rectangles
- Health check endpoint
- CORS configuration for development and production

## Installation

\`\`\`bash
cd server
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Production

\`\`\`bash
npm start
\`\`\`

## API Endpoints

### Health Check
- **GET** `/health` - Returns server status and statistics

## Socket Events

### Client to Server
- `rectangle:add` - Create a new rectangle
- `rectangle:move` - Update rectangle position
- `rectangle:delete` - Delete a rectangle

### Server to Client
- `canvas:state` - Full canvas state (sent on connection)
- `rectangle:add` - New rectangle created by another user
- `rectangle:move` - Rectangle moved by another user
- `rectangle:delete` - Rectangle deleted by another user
- `user:count` - Updated connected user count

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Architecture Notes

- Canvas state is stored in memory (consider Redis for production scaling)
- Rectangles are automatically cleaned up 30 seconds after user disconnection
- CORS is configured for both development and production environments
