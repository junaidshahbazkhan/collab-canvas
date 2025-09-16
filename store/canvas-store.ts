"use client"

import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { useEffect, useState } from "react"
import type { Rectangle } from "@/types/canvas"
import { createRectangle, updateRectanglePosition } from "@/utils/rectangle-utils"

interface CanvasState {
  // Canvas data
  rectangles: Rectangle[]

  // Connection state
  isConnected: boolean
  connectedUsers: number

  // UI state
  isLoading: boolean
  error: string | null

  // Actions
  addRectangle: (rectangle?: Rectangle) => Rectangle
  moveRectangle: (id: string, x: number, y: number) => void
  removeRectangle: (id: string) => void
  setRectangles: (rectangles: Rectangle[]) => void

  // Connection actions
  setConnectionState: (isConnected: boolean) => void
  setConnectedUsers: (count: number) => void

  // UI actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Bulk operations
  syncCanvasState: (state: { rectangles: Rectangle[]; connectedUsers: number }) => void
  clearCanvas: () => void

  // Getters
  getRectangleById: (id: string) => Rectangle | undefined
  getRectangleCount: () => number
}

export const useCanvasStore = create<CanvasState>()(
  devtools(
    (set, get) => ({
      // Initial state
      rectangles: [],
      isConnected: false,
      connectedUsers: 0,
      isLoading: false,
      error: null,

      // Rectangle actions
      addRectangle: (rectangle) => {
        const newRect = rectangle || createRectangle()
        set(
          (state) => ({
            rectangles: [...state.rectangles, newRect],
            error: null,
          }),
          false,
          "addRectangle",
        )
        return newRect
      },

      moveRectangle: (id, x, y) => {
        set(
          (state) => ({
            rectangles: updateRectanglePosition(state.rectangles, id, x, y),
          }),
          false,
          "moveRectangle",
        )
      },

      removeRectangle: (id) => {
        set(
          (state) => ({
            rectangles: state.rectangles.filter((rect) => rect.id !== id),
          }),
          false,
          "removeRectangle",
        )
      },

      setRectangles: (rectangles) => {
        set({ rectangles }, false, "setRectangles")
      },

      // Connection actions
      setConnectionState: (isConnected) => {
        set({ isConnected }, false, "setConnectionState")
      },

      setConnectedUsers: (connectedUsers) => {
        set({ connectedUsers }, false, "setConnectedUsers")
      },

      // UI actions
      setLoading: (isLoading) => {
        set({ isLoading }, false, "setLoading")
      },

      setError: (error) => {
        set({ error }, false, "setError")
      },

      // Bulk operations
      syncCanvasState: (state) => {
        set(
          {
            rectangles: state.rectangles,
            connectedUsers: state.connectedUsers,
            error: null,
          },
          false,
          "syncCanvasState",
        )
      },

      clearCanvas: () => {
        set({ rectangles: [] }, false, "clearCanvas")
      },

      // Getters
      getRectangleById: (id) => {
        return get().rectangles.find((rect) => rect.id === id)
      },

      getRectangleCount: () => {
        return get().rectangles.length
      },
    }),
    {
      name: "canvas-store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
)

export const canvasStore = useCanvasStore

// Selectors for optimized re-renders
export const useRectangles = () => {
  const [hydrated, setHydrated] = useState(false)
  const [rectangles, setRectangles] = useState<Rectangle[]>([])

  useEffect(() => {
    setHydrated(true)
    const unsubscribe = useCanvasStore.subscribe(
      (state) => state.rectangles,
      (rectangles) => setRectangles(rectangles),
    )
    setRectangles(useCanvasStore.getState().rectangles)

    return unsubscribe
  }, [])

  if (!hydrated) {
    return []
  }

  return rectangles
}

export const useConnectionState = () => {
  const [hydrated, setHydrated] = useState(false)
  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    connectedUsers: 0,
  })

  useEffect(() => {
    setHydrated(true)
    const unsubscribe = useCanvasStore.subscribe(
      (state) => ({ isConnected: state.isConnected, connectedUsers: state.connectedUsers }),
      (newState) => setConnectionState(newState),
    )
    const currentState = useCanvasStore.getState()
    setConnectionState({
      isConnected: currentState.isConnected,
      connectedUsers: currentState.connectedUsers,
    })

    return unsubscribe
  }, [])

  if (!hydrated) {
    return {
      isConnected: false,
      connectedUsers: 0,
    }
  }

  return connectionState
}

export const useCanvasActions = () => {
  const [hydrated, setHydrated] = useState(false)
  const [actions, setActions] = useState({
    addRectangle: () => ({ id: "", x: 0, y: 0, width: 0, height: 0, fill: "" }),
    moveRectangle: () => {},
    removeRectangle: () => {},
    syncCanvasState: () => {},
  })

  useEffect(() => {
    setHydrated(true)
    const store = useCanvasStore.getState()
    setActions({
      addRectangle: store.addRectangle,
      moveRectangle: store.moveRectangle,
      removeRectangle: store.removeRectangle,
      syncCanvasState: store.syncCanvasState,
    })
  }, [])

  if (!hydrated) {
    return {
      addRectangle: () => ({ id: "", x: 0, y: 0, width: 0, height: 0, fill: "" }),
      moveRectangle: () => {},
      removeRectangle: () => {},
      syncCanvasState: () => {},
    }
  }

  return actions
}

// Hydration-safe hook for UI state (loading and error)
export const useCanvasUIState = () => {
  const [hydrated, setHydrated] = useState(false)
  const [uiState, setUIState] = useState({
    isLoading: false,
    error: null as string | null,
  })

  useEffect(() => {
    setHydrated(true)
    const unsubscribe = useCanvasStore.subscribe(
      (state) => ({ isLoading: state.isLoading, error: state.error }),
      (newState) => setUIState(newState),
    )
    const currentState = useCanvasStore.getState()
    setUIState({
      isLoading: currentState.isLoading,
      error: currentState.error,
    })

    return unsubscribe
  }, [])

  if (!hydrated) {
    return {
      isLoading: false,
      error: null,
    }
  }

  return uiState
}
