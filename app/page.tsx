"use client"

import { useCallback, useEffect, useState } from "react"
import { CanvasStage } from "@/components/canvas-stage"
import { CanvasControls } from "@/components/canvas-controls"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useSocket } from "@/hooks/use-socket"
import { useCanvasStore } from "@/store/canvas-store"

export default function CollaborativeCanvasClient() {
  const [mounted, setMounted] = useState(false)

  const rectangles = useCanvasStore((state) => state.rectangles)
  const isConnected = useCanvasStore((state) => state.isConnected)
  const connectedUsers = useCanvasStore((state) => state.connectedUsers)
  const isLoading = useCanvasStore((state) => state.isLoading)
  const error = useCanvasStore((state) => state.error)
  const addRectangle = useCanvasStore((state) => state.addRectangle)
  const moveRectangle = useCanvasStore((state) => state.moveRectangle)

  const { emitRectangleAdd, emitRectangleMove } = useSocket()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddRectangle = useCallback(() => {
    const newRect = addRectangle()
    emitRectangleAdd(newRect)
  }, [addRectangle, emitRectangleAdd])

  const handleRectangleMove = useCallback(
    (id: string, x: number, y: number) => {
      moveRectangle(id, x, y)
      emitRectangleMove(id, x, y)
    },
    [moveRectangle, emitRectangleMove],
  )

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">Collaborative Canvas</h1>
            <p className="text-muted-foreground text-pretty">
              Real-time collaborative drawing with React Konva and Socket.io.
            </p>
          </div>
          <Alert className="mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>Loading canvas...</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">Collaborative Canvas</h1>
          <p className="text-muted-foreground text-pretty">
            Real-time collaborative drawing with React Konva and Socket.io. Add rectangles and drag them around -
            changes sync across all connected users.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Alert className="mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>Connecting to server...</AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Connection Status Alert */}
        {!isConnected && !isLoading && !error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connecting to server... Make sure the backend server is running on port 3001.
            </AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <CanvasControls
          onAddRectangle={handleAddRectangle}
          connectedUsers={connectedUsers}
          isConnected={isConnected}
          rectangleCount={rectangles.length}
        />

        {/* Canvas */}
        <Card className="p-4">
          <CanvasStage rectangles={rectangles} onRectangleMove={handleRectangleMove} />
        </Card>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Click "Add Rectangle" to create new shapes • Drag rectangles to move them around
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Open multiple browser tabs to test real-time synchronization
          </p>
          {isConnected && (
            <p className="text-xs text-green-600 mt-2">✓ Connected to server - changes will sync in real-time</p>
          )}
        </div>
      </div>
    </div>
  )
}