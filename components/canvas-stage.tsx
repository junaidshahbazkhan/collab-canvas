"use client"

import { useRef, useCallback } from "react"
import { Stage, Layer, Rect } from "react-konva"
import type { Rectangle } from "@/types/canvas"

interface CanvasStageProps {
  rectangles: Rectangle[]
  onRectangleMove: (id: string, x: number, y: number) => void
  width?: number
  height?: number
}

export function CanvasStage({ rectangles, onRectangleMove, width = 800, height = 600 }: CanvasStageProps) {
  const stageRef = useRef(null)

  const handleDragMove = useCallback(
    (id: string, x: number, y: number) => {
      onRectangleMove(id, x, y)
    },
    [onRectangleMove],
  )

  return (
    <div className="border-2 border-dashed border-border rounded-lg overflow-hidden bg-card">
      <Stage ref={stageRef} width={width} height={height}>
        <Layer>
          {rectangles.map((rect) => (
            <Rect
              key={rect.id}
              id={rect.id}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
              draggable
              onDragMove={(e) => {
                const node = e.target
                handleDragMove(rect.id, node.x(), node.y())
              }}
              shadowColor="rgba(0, 0, 0, 0.3)"
              shadowBlur={6}
              shadowOpacity={0.3}
              shadowOffsetX={3}
              shadowOffsetY={3}
              cornerRadius={4}
              // Add hover effects
              onMouseEnter={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = "move"
                }
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage()
                if (stage) {
                  stage.container().style.cursor = "default"
                }
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
