import type { Rectangle } from "@/types/canvas"

const COLORS = [
  "hsl(210, 70%, 60%)", // Blue
  "hsl(150, 70%, 60%)", // Green
  "hsl(30, 70%, 60%)", // Orange
  "hsl(270, 70%, 60%)", // Purple
  "hsl(0, 70%, 60%)", // Red
  "hsl(180, 70%, 60%)", // Cyan
  "hsl(60, 70%, 60%)", // Yellow
  "hsl(300, 70%, 60%)", // Magenta
]

export function createRectangle(canvasWidth = 800, canvasHeight = 600): Rectangle {
  const margin = 50
  const rectWidth = 100
  const rectHeight = 80

  return {
    id: `rect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    x: Math.random() * (canvasWidth - rectWidth - margin * 2) + margin,
    y: Math.random() * (canvasHeight - rectHeight - margin * 2) + margin,
    width: rectWidth,
    height: rectHeight,
    fill: COLORS[Math.floor(Math.random() * COLORS.length)],
    createdAt: Date.now(),
  }
}

export function updateRectanglePosition(rectangles: Rectangle[], id: string, x: number, y: number): Rectangle[] {
  return rectangles.map((rect) => (rect.id === id ? { ...rect, x, y } : rect))
}
