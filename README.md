# collab-canvas

A full-stack collaborative canvas application built with React, Next.js, Socket.io, and React Konva. Multiple users can create and manipulate rectangles on a shared canvas in real-time.

## Setup

### Installation
```bash
# Clone repo
git clone <repository-url>
cd collaborative-canvas

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Start backend
cd server
npm run dev

# In another terminal, start frontend
npm run dev

Frontend → http://localhost:3000
Backend health check → http://localhost:3001/health

