const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
const httpServer = createServer(app)

// Configure CORS for Socket.io
const io = new Server(httpServer, {
  cors: {
    origin:
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Enable CORS for Express
app.use(
  cors({
    origin:
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
    credentials: true,
  }),
)

app.use(express.json())

// Store canvas state in memory (in production, use Redis or database)
const canvasState = {
  rectangles: [],
  connectedUsers: 0,
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    connectedUsers: canvasState.connectedUsers,
    rectangles: canvasState.rectangles.length,
    timestamp: new Date().toISOString(),
  })
})

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Update connected users count
  canvasState.connectedUsers++

  // Send current canvas state to new user
  socket.emit("canvas:state", {
    rectangles: canvasState.rectangles,
    connectedUsers: canvasState.connectedUsers,
  })

  // Broadcast updated user count to all clients
  io.emit("user:count", canvasState.connectedUsers)

  // Handle rectangle creation
  socket.on("rectangle:add", (rectangle) => {
    console.log(`Rectangle added by ${socket.id}:`, rectangle)

    // Add rectangle to canvas state
    canvasState.rectangles.push({
      ...rectangle,
      createdBy: socket.id,
      createdAt: Date.now(),
    })

    // Broadcast to all other clients (not the sender)
    socket.broadcast.emit("rectangle:add", rectangle)
  })

  // Handle rectangle movement
  socket.on("rectangle:move", (data) => {
    console.log(`Rectangle moved by ${socket.id}:`, data)

    // Update rectangle position in canvas state
    const rectangleIndex = canvasState.rectangles.findIndex((rect) => rect.id === data.id)
    if (rectangleIndex !== -1) {
      canvasState.rectangles[rectangleIndex].x = data.x
      canvasState.rectangles[rectangleIndex].y = data.y
    }

    // Broadcast to all other clients (not the sender)
    socket.broadcast.emit("rectangle:move", data)
  })

  // Handle rectangle deletion (optional feature)
  socket.on("rectangle:delete", (rectangleId) => {
    console.log(`Rectangle deleted by ${socket.id}:`, rectangleId)

    // Remove rectangle from canvas state
    canvasState.rectangles = canvasState.rectangles.filter((rect) => rect.id !== rectangleId)

    // Broadcast to all other clients
    socket.broadcast.emit("rectangle:delete", rectangleId)
  })

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`)

    // Update connected users count
    canvasState.connectedUsers = Math.max(0, canvasState.connectedUsers - 1)

    // Broadcast updated user count to all remaining clients
    io.emit("user:count", canvasState.connectedUsers)

    // Optional: Clean up rectangles created by disconnected user after timeout
    // This prevents accumulation of abandoned rectangles
    setTimeout(() => {
      const initialCount = canvasState.rectangles.length
      canvasState.rectangles = canvasState.rectangles.filter((rect) => rect.createdBy !== socket.id)

      if (canvasState.rectangles.length < initialCount) {
        console.log(
          `Cleaned up ${initialCount - canvasState.rectangles.length} rectangles from disconnected user ${socket.id}`,
        )
        io.emit("canvas:state", {
          rectangles: canvasState.rectangles,
          connectedUsers: canvasState.connectedUsers,
        })
      }
    }, 30000) // 30 second delay before cleanup
  })

  // Handle errors
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error)
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Express error:", err)
  res.status(500).json({ error: "Internal server error" })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`🚀 Collaborative Canvas Server running on port ${PORT}`)
  console.log(`📊 Health check available at http://localhost:${PORT}/health`)
  console.log(`🔌 Socket.io server ready for connections`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  httpServer.close(() => {
    console.log("Server closed")
    process.exit(0)
  })
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  httpServer.close(() => {
    console.log("Server closed")
    process.exit(0)
  })
})
