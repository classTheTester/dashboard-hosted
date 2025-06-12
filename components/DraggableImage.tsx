import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"

interface DraggableImageProps {
  url: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  onDragEnd: (position: { x: number; y: number }) => void
  onResize: (size: { width: number; height: number }) => void
}

export function DraggableImage({ url, position, size, onDragEnd, onResize }: DraggableImageProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialSize, setInitialSize] = useState(size)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button === 0) {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [position],
  )

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsResizing(true)
      setInitialSize(size)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })
    },
    [size],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        onDragEnd({ x: newX, y: newY })
      } else if (isResizing) {
        const dx = e.clientX - dragStart.x
        const dy = e.clientY - dragStart.y
        const newWidth = Math.max(50, initialSize.width + dx)
        const newHeight = Math.max(50, initialSize.height + dy)
        onResize({ width: newWidth, height: newHeight })
      }
    },
    [isDragging, isResizing, dragStart, initialSize, onDragEnd, onResize],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={imageRef}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: 10,
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={url || "/placeholder.svg"}
        alt="Draggable image"
        className="w-full h-full object-cover rounded-md shadow-lg"
        draggable={false}
      />
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" onMouseDown={handleResizeStart} />
    </div>
  )
}

