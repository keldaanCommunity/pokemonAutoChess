import { t } from "i18next"
import React, { ReactNode, useEffect, useState } from "react"
import { useDraggable } from "../../utils/draggable"
import "./draggable-window.css"

interface DraggableWindowProps {
  title: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  defaultMinimized?: boolean
  initialPosition?: { x: number; y: number }
  minimizeButtonTitle?: string
  maximizeButtonTitle?: string
  onToggleMinimize?: (minimized: boolean) => void
  onMove?: (position: { x: number; y: number }) => void
}

export default function DraggableWindow({
  title,
  children,
  className = "",
  style = {},
  defaultMinimized = false,
  initialPosition = { x: 0, y: 0 },
  minimizeButtonTitle = t("minimize"),
  maximizeButtonTitle = t("maximize"),
  onToggleMinimize,
  onMove
}: DraggableWindowProps) {
  const [isMinimized, setMinimized] = useState(defaultMinimized)
  const { position, isDragging, handleMouseDown, containerRef } = useDraggable({
    initialPosition,
    margin: 8
  })
  useEffect(() => {
    onToggleMinimize?.(isMinimized)
  }, [isMinimized, onToggleMinimize])
  useEffect(() => {
    onMove?.(position)
  }, [position, onMove])

  return (
    <div
      ref={containerRef}
      className={`draggable-window ${className} ${isMinimized ? "minimized" : "maximized"}`}
      style={{
        ...style,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "default"
      }}
    >
      <div
        className="draggable-window-header"
        onMouseDown={(e) =>
          handleMouseDown(e, ".draggable-window-header-button")
        }
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <h3 className="draggable-window-title">{title}</h3>
        <button
          className="draggable-window-header-button"
          onClick={() => setMinimized(!isMinimized)}
          title={isMinimized ? maximizeButtonTitle : minimizeButtonTitle}
        >
          {isMinimized ? "➕" : "➖"}
        </button>
      </div>
      {!isMinimized && (
        <div className="draggable-window-content">{children}</div>
      )}
    </div>
  )
}
