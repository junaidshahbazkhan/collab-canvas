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
}

export interface ServerToClientEvents {
  "canvas:state": (state: CanvasState) => void
  "rectangle:add": (rectangle: Rectangle) => void
  "rectangle:move": (data: { id: string; x: number; y: number }) => void
  "rectangle:delete": (rectangleId: string) => void
  "user:count": (count: number) => void
}

export interface ClientToServerEvents {
  "rectangle:add": (rectangle: Rectangle) => void
  "rectangle:move": (data: { id: string; x: number; y: number }) => void
  "rectangle:delete": (rectangleId: string) => void
}
