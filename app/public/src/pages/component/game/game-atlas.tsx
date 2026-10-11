import { useEffect, useRef } from "react"
import { DEPTH } from "../../../game/depths"
import { useAppSelector } from "../../../hooks"
import { Atlas } from "../atlas/atlas"

function updateAtlasPosition() {
  const orb = document.getElementById("game-connection-orb-icon")
  const atlas = document.getElementById("game-atlas")
  if (!orb || !atlas) return
  const { top, right } = orb.getBoundingClientRect()
  atlas.style.bottom = `${window.innerHeight - top + 20}px`
  atlas.style.right = `${window.innerWidth - right - 0.15 * window.innerWidth + 33}px`
}

export default function GameAtlas() {
  const atlasVisible = useAppSelector((state) => state.game.atlasVisible)
  const containerRef = useRef<HTMLDivElement>(null)
  const wasVisible = useRef(false)

  useEffect(() => {
    if (wasVisible.current === atlasVisible) return
    wasVisible.current = atlasVisible
    const mask = containerRef.current?.querySelector<HTMLElement>(".atlas-mask")
    if (!mask) return
    mask.classList.toggle("opening", atlasVisible)
    mask.classList.toggle("closing", !atlasVisible)
  }, [atlasVisible])

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      updateAtlasPosition()
    }
    // Add event listener
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures that effect is only run on mount

  return (
    <div
      id="game-atlas"
      ref={containerRef}
      style={{
        zIndex: DEPTH.ATLAS,
        pointerEvents: atlasVisible ? "auto" : "none"
      }}
    >
      <Atlas origin="game" />
    </div>
  )
}
