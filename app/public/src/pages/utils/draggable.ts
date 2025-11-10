import { RefObject, useEffect, useRef, useState } from "react"
import { clamp } from "../../../../utils/number"

const SIDEBAR_WIDTH = 60

interface Position {
  x: number
  y: number
}

interface UseDraggableOptions {
  initialPosition?: Position
  containerRef?: RefObject<HTMLElement>
  margin?: number // margin from viewport edges in pixels
}

interface UseDraggableReturn {
  position: Position
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent, ignoreSelector?: string) => void
  containerRef: RefObject<HTMLDivElement | null>
}

export function useDraggable(
  options: UseDraggableOptions = {}
): UseDraggableReturn {
  const { initialPosition = { x: 0, y: 0 }, margin = 40 } = options

  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({
    startMouseX: 0,
    startMouseY: 0,
    startPosX: 0,
    startPosY: 0,
    startLeft: 0,
    startTop: 0,
    width: 0,
    height: 0
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - dragRef.current.startMouseX
        const dy = e.clientY - dragRef.current.startMouseY
        const proposedLeft = dragRef.current.startLeft + dx
        const proposedTop = dragRef.current.startTop + dy
        const maxLeft = window.innerWidth - margin - dragRef.current.width
        const maxTop = window.innerHeight - margin - dragRef.current.height
        const clampedLeft = clamp(
          proposedLeft,
          SIDEBAR_WIDTH + margin,
          Math.max(margin, maxLeft)
        )
        const clampedTop = clamp(proposedTop, margin, Math.max(margin, maxTop))
        // Translate back to transform-based position relative to start
        const newX =
          dragRef.current.startPosX + (clampedLeft - dragRef.current.startLeft)
        const newY =
          dragRef.current.startPosY + (clampedTop - dragRef.current.startTop)
        setPosition({ x: newX, y: newY })
      }

      const handleMouseUp = () => {
        setIsDragging(false)
      }

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

  // Clamp position on mount and on resize to ensure it's always on-screen
  useEffect(() => {
    const clampCurrentPosition = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      const width = rect?.width ?? 0
      const height = rect?.height ?? 0
      const maxLeft = window.innerWidth - margin - width
      const maxTop = window.innerHeight - margin - height
      // Derive current rect left/top from current transform position
      const currentLeft = rect?.left ?? 0
      const currentTop = rect?.top ?? 0
      const clampedLeft = clamp(
        currentLeft,
        SIDEBAR_WIDTH + margin,
        Math.max(margin, maxLeft)
      )
      const clampedTop = clamp(currentTop, margin, Math.max(margin, maxTop))
      // Compute delta to apply to position transform
      const dx = clampedLeft - currentLeft
      const dy = clampedTop - currentTop
      if (dx !== 0 || dy !== 0) {
        setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
      }
    }
    clampCurrentPosition()
    const onResize = () => clampCurrentPosition()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [margin])

  const handleMouseDown = (e: React.MouseEvent, ignoreSelector?: string) => {
    // If an ignore selector is provided, check if the click target matches it
    if (ignoreSelector && (e.target as HTMLElement).closest(ignoreSelector)) {
      return
    }
    setIsDragging(true)
    const rect = containerRef.current?.getBoundingClientRect()
    dragRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
      startLeft: rect?.left ?? 0,
      startTop: rect?.top ?? 0,
      width: rect?.width ?? 0,
      height: rect?.height ?? 0
    }
  }

  return {
    position,
    isDragging,
    handleMouseDown,
    containerRef
  }
}
