export interface Rectangle {
  id: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  createdBy?: string
  createdAt: number
}

export interface CanvasState {
  rectangles: Rectangle[]
  connectedUsers: number
  isConnected: boolean
}

export interface SocketEvents {
  "rectangle:add": (rectangle: Rectangle) => void
  "rectangle:move": (data: { id: string; x: number; y: number }) => void
  "user:connected": (count: number) => void
  "user:disconnected": (count: number) => void
}
