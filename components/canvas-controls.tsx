"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Wifi, WifiOff } from "lucide-react"

interface CanvasControlsProps {
  onAddRectangle: () => void
  connectedUsers: number
  isConnected: boolean
  rectangleCount: number
}

export function CanvasControls({ onAddRectangle, connectedUsers, isConnected, rectangleCount }: CanvasControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Button onClick={onAddRectangle} className="flex items-center gap-2" disabled={!isConnected}>
          <Plus className="w-4 h-4" />
          Add Rectangle
        </Button>

        <Badge variant="secondary" className="text-sm">
          {rectangleCount} rectangle{rectangleCount !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <Card className="px-3 py-2 flex items-center gap-2">
          {isConnected ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
          <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
        </Card>

        <Card className="px-3 py-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {connectedUsers} user{connectedUsers !== 1 ? "s" : ""}
          </span>
        </Card>
      </div>
    </div>
  )
}
