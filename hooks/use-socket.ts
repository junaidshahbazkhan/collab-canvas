"use client"

import { useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"
import type { Rectangle } from "@/types/canvas"
import { useCanvasStore } from "@/store/canvas-store"

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)

  const { setConnectionState, setConnectedUsers, addRectangle, moveRectangle, syncCanvasState, setError, setLoading } =
    useCanvasStore()

  useEffect(() => {
    setLoading(true)

    // Initialize socket connection
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"

    const socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    })

    socketRef.current = socket

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id)
      setConnectionState(true)
      setError(null)
      setLoading(false)
    })

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason)
      setConnectionState(false)
      setError(`Disconnected: ${reason}`)
    })

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error)
      setConnectionState(false)
      setError(`Connection failed: ${error.message}`)
      setLoading(false)
    })

    // Canvas event handlers
    socket.on("canvas:state", (state) => {
      console.log("Received canvas state:", state)
      syncCanvasState(state)
    })

    socket.on("rectangle:add", (rectangle) => {
      console.log("Rectangle added by another user:", rectangle)
      addRectangle(rectangle)
    })

    socket.on("rectangle:move", (data) => {
      console.log("Rectangle moved by another user:", data)
      moveRectangle(data.id, data.x, data.y)
    })

    socket.on("user:count", (count) => {
      console.log("User count updated:", count)
      setConnectedUsers(count)
    })

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up socket connection")
      socket.disconnect()
      socketRef.current = null
      setConnectionState(false)
    }
  }, [setConnectionState, setConnectedUsers, addRectangle, moveRectangle, syncCanvasState, setError, setLoading])

  // Socket emission functions
  const emitRectangleAdd = (rectangle: Rectangle) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("rectangle:add", rectangle)
    }
  }

  const emitRectangleMove = (id: string, x: number, y: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("rectangle:move", { id, x, y })
    }
  }

  return {
    emitRectangleAdd,
    emitRectangleMove,
  }
}
